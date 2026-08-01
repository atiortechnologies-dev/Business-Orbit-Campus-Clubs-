/**
 * @file chatRoomService.js
 * @description Service layer for chat room related database queries and aggregations.
 * @architecture Encapsulates complex MongoDB aggregations to keep controllers thin and focused on HTTP concerns.
 */

const ChatRoom = require("../models/ChatRoom");

/**
/**
 * Gets hydrated chat rooms for a user, including participant name, latest message, and unread count.
 * Optimizes MongoDB aggregations by strictly limiting sub-pipeline lookups instead of loading arrays into memory.
 *
 * @param {mongoose.Types.ObjectId} userId - The user's ID
 * @param {string} role - The user's role ('student' or 'mentor')
 * @param {number|null} limit - Optional limit on the number of returned chats
 * @returns {Promise<Array>} Array of hydrated chat room objects
 */
exports.getHydratedChatRooms = async (userId, role, limit = null) => {
  const mongoose = require("mongoose");
  const uid = new mongoose.Types.ObjectId(userId);
  const matchObj = role === "mentor" ? { mentor_id: uid } : { student_id: uid };
  const lookupField = role === "mentor" ? "student_id" : "mentor_id";


  const pipeline = [
    { $match: matchObj },
    {
      $lookup: {
        from: "users",
        localField: lookupField,
        foreignField: "_id",
        as: "participant",
      },
    },
    { $unwind: { path: "$participant", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "startups",
        localField: "startup_id",
        foreignField: "_id",
        as: "startup",
      },
    },
    { $unwind: { path: "$startup", preserveNullAndEmptyArrays: true } },
    {
      // Sub-pipeline 1: Fetch ONLY the single most recent message
      $lookup: {
        from: "messages",
        let: { chatId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$chat_id", "$$chatId"] } } },
          { $sort: { created_at: -1 } },
          { $limit: 1 },
        ],
        as: "lastMessageDoc",
      },
    },
    {
      // Sub-pipeline 2: Push counting logic down to the DB engine
      $lookup: {
        from: "messages",
        let: { chatId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$chat_id", "$$chatId"] },
                  { $eq: ["$read_at", null] },
                  { $ne: ["$sender_id", uid] },
                ],
              },
            },
          },
          { $count: "count" },
        ],
        as: "unreadData",
      },
    },
    {
      $addFields: {
        lastMessage: { $arrayElemAt: ["$lastMessageDoc", 0] },
        unreadCount: {
          $ifNull: [{ $arrayElemAt: ["$unreadData.count", 0] }, 0],
        },
      },
    },
    { $sort: { "lastMessage.created_at": -1 } },
  ];

  if (limit) {
    pipeline.push({ $limit: limit });
  }

  pipeline.push({
    $project: {
      chatId: "$_id",
      studentId: "$student_id",
      mentorId: "$mentor_id",
      startupId: "$startup_id",
      participantName: "$participant.full_name",
      startupName: "$startup.startup_name",
      lastMessage: "$lastMessage.message",
      lastMessageTime: "$lastMessage.created_at",
      onlineStatus: "offline",
      unreadCount: "$unreadCount",
    },
  });

  return ChatRoom.aggregate(pipeline);
};
