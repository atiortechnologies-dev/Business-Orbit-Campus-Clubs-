/**
 * @file chapter.controller.js
 * @description Administrative chapter governance operations (overview, students, startups, assign-lead).
 * @architecture Controllers strictly for admin operations for Chapter management.
 */

const asyncHandler = require("../../middlewares/asyncHandler");
const Chapter = require("../../models/Chapter");
const StudentProfile = require("../../models/StudentProfile");
const Startup = require("../../models/Startup");
const ChapterEvent = require("../../models/ChapterEvent");
const AuditLog = require("../../models/AuditLog");
const User = require("../../models/User");
const Notification = require("../../models/Notification");
const mongoose = require("mongoose");

const formatPaginatedResponse = (data, page, limit, totalRecords, metrics = {}) => ({
  data,
  page: Number(page),
  limit: Number(limit),
  total_records: totalRecords,
  total_pages: Math.ceil(totalRecords / limit),
  metrics
});

/**
 * @desc    Get chapter overview and high-level stats
 * @route   GET /api/admin/chapters/:id/overview
 * @access  Private (Admin)
 */
exports.getChapterOverview = asyncHandler(async (req, res) => {
  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) {
    return res.status(404).json({ success: false, message: "Chapter not found" });
  }

  // Calculate some real metrics if required, but Chapter model has them:
  // total_members, active_startups, mentors_count, events_conducted
  // Alternatively, query them real-time.
  const total_students = await StudentProfile.countDocuments({ chapter_id: chapter._id });
  const active_startups = await Startup.countDocuments({ chapter_id: chapter._id, status: "active" });

  res.status(200).json({
    success: true,
    data: {
      chapter: {
        id: chapter._id,
        chapter_name: chapter.chapter_name,
        college_name: chapter.college_name,
        status: chapter.status,
        health_score: chapter.health_score,
        location: chapter.location,
        chapter_lead_id: chapter.chapter_lead_id,
      },
      metrics: {
        total_students: total_students || chapter.total_members,
        active_startups: active_startups || chapter.active_startups,
        mentors_count: chapter.mentors_count,
        upcoming_events: chapter.events_conducted, // Or query upcoming events if we had ChapterEvent
      },
    },
  });
});

/**
 * @desc    List students filtered by chapter
 * @route   GET /api/admin/chapters/:id/students
 * @access  Private (Admin)
 */
exports.getChapterStudents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { chapter_id: req.params.id };

  const totalRecords = await StudentProfile.countDocuments(filter);
  const students = await StudentProfile.find(filter)
    .populate("user_id", "full_name email")
    .skip(skip)
    .limit(limit)
    .lean();

  const totalStartupsCount = await Startup.countDocuments({ chapter_id: req.params.id });

  res.status(200).json({
    success: true,
    ...formatPaginatedResponse(students, page, limit, totalRecords, {
      total_students: totalRecords,
      active_startups: totalStartupsCount,
      completion_rate: 100, // Placeholder
      pending_reviews: 0, // Placeholder
    })
  });
});

/**
 * @desc    List startups filtered by chapter
 * @route   GET /api/admin/chapters/:id/startups
 * @access  Private (Admin)
 */
exports.getChapterStartups = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = { chapter_id: req.params.id };

  const totalRecords = await Startup.countDocuments(filter);
  const startups = await Startup.find(filter)
    .skip(skip)
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    ...formatPaginatedResponse(startups, page, limit, totalRecords, {
      total_startups: totalRecords,
      active_startups: totalRecords, // Simplified
      incubated_count: 0,
      launched_count: 0,
    })
  });
});

/**
 * @desc    Update chapter lead
 * @route   PUT /api/admin/chapters/:id/assign-lead
 * @access  Private (Admin)
 */
exports.assignChapterLead = asyncHandler(async (req, res) => {
  const { chapter_lead_id } = req.body;

  if (!mongoose.Types.ObjectId.isValid(chapter_lead_id)) {
    return res.status(400).json({ success: false, message: "Invalid chapter_lead_id" });
  }

  const user = await User.findById(chapter_lead_id);
  if (!user || user.account_status !== "active") {
    return res.status(400).json({ success: false, message: "User not found or not active" });
  }

  const chapter = await Chapter.findByIdAndUpdate(
    req.params.id,
    { chapter_lead_id },
    { new: true, runValidators: true }
  );

  if (!chapter) {
    return res.status(404).json({ success: false, message: "Chapter not found" });
  }

  await AuditLog.create({
    actor_id: req.user.id,
    actor_name: req.user.full_name || "Admin",
    module: "CHAPTERS",
    action: "CHAPTER_LEAD_ASSIGNED",
    target_entity_id: chapter._id.toString(),
    target_entity_name: chapter.chapter_name,
    status: "SUCCESS",
    ip_address: req.ip,
    details: { assigned_lead_id: chapter_lead_id },
  });

  res.status(200).json({
    success: true,
    message: "Chapter lead assigned successfully",
    data: {
      chapter: {
        id: chapter._id,
        chapter_lead_id: chapter.chapter_lead_id,
      },
    },
  });
});

/**
 * @desc    List events scheduled by chapter
 * @route   GET /api/admin/chapters/:id/events
 * @access  Private (Admin)
 */
exports.getChapterEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const chapterId = req.params.id;
  const filter = { chapter_id: chapterId };

  // Need to import ChapterEvent at the top. Wait, we will require it here to avoid error or we can just require it if not imported.
  const ChapterEvent = require("../../models/ChapterEvent");

  const totalRecords = await ChapterEvent.countDocuments(filter);
  const events = await ChapterEvent.find(filter)
    .sort({ event_date: 1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const upcoming = await ChapterEvent.countDocuments({ chapter_id: chapterId, status: { $in: ["PENDING", "ACTIVE", "scheduled"] } });
  const completed = await ChapterEvent.countDocuments({ chapter_id: chapterId, status: { $in: ["COMPLETED", "completed"] } });

  // Calculate total registrations and average attendance %
  // Simplified for now based on PRD requirements.
  let total_registrations = 0;
  events.forEach(e => total_registrations += (e.total_registrations || 0));

  res.status(200).json({
    success: true,
    ...formatPaginatedResponse(events, page, limit, totalRecords, {
      upcoming,
      completed,
      total_registrations,
      average_attendance_pct: 0 // Placeholder
    })
  });
});

/**
 * @desc    Create new chapter event
 * @route   POST /api/admin/chapters/:id/events
 * @access  Private (Admin)
 */
exports.createChapterEvent = asyncHandler(async (req, res) => {
  const { title, description, category, event_date, location_venue, max_capacity } = req.body;
  const chapterId = req.params.id;

  if (!title || !description || !category || !event_date || !location_venue || !max_capacity) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  if (max_capacity <= 0) {
    return res.status(400).json({ success: false, message: "max_capacity must be greater than 0" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [newEvent] = await ChapterEvent.create([{
      chapter_id: chapterId,
      title,
      description,
      category,
      event_date,
      location_venue,
      max_capacity,
      status: "ACTIVE"
    }], { session });

    await AuditLog.create([{
      actor_id: req.user.id,
      actor_name: req.user.full_name || "Admin",
      module: "CHAPTERS",
      action: "CHAPTER_EVENT_CREATED",
      target_entity_id: newEvent._id.toString(),
      target_entity_name: newEvent.title,
      status: "SUCCESS",
      ip_address: req.ip,
      details: { event_id: newEvent._id },
    }], { session });

    const students = await StudentProfile.find({ chapter_id: chapterId }).select("user_id").lean();
    if (students && students.length > 0) {
      const notifications = students.map(s => ({
        recipient_id: s.user_id,
        title: "New Chapter Event",
        message: `A new event "${newEvent.title}" has been scheduled in your chapter.`,
        type: "info"
      }));
      await Notification.insertMany(notifications, { session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Chapter event created successfully",
      data: {
        event: newEvent
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
