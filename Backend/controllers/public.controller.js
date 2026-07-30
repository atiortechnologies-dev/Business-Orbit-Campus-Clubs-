/**
 * @file public.controller.js
 * @description Handles business logic for fetching public-facing content like landing page data, FAQs, and public profiles.
 * @architecture Isolates read-only, unauthenticated data access logic from secure, authenticated operational logic.
 */

const FAQ = require("../models/FAQ");
const Statistic = require("../models/Statistic");
const PartnerLogo = require("../models/PartnerLogo");
const FeaturedStartup = require("../models/FeaturedStartup");
const SuccessStory = require("../models/SuccessStory");

/**
 * @route   GET /api/public/auth-redirects
 * @desc    Get frontend routing URLs for authentication redirects
 * @access  Public
 */
exports.getAuthRedirects = async (req, res, next) => {
  try {
    const redirects = {
      login: "/auth/login",
      register: "/auth/role-selection",
      apply_student: "/auth/register?role=student",
      join_investor: "/auth/register?role=investor",
      become_mentor: "/auth/register?role=mentor",
      partner_bocc: "/auth/register?role=company",
      apply_partner: "/auth/register?role=incubator",
    };
    res.status(200).json({ success: true, data: redirects });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/public/faqs
 * @desc    Get FAQs, optionally filtered by pageType
 * @access  Public
 */
exports.getFaqs = async (req, res, next) => {
  try {
    const { pageType } = req.query;
    const filter = pageType ? { pageType } : {};
    const faqs = await FAQ.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/public/statistics/:pageType
 * @desc    Get statistics for a specific landing page
 * @access  Public
 */
exports.getStatistics = async (req, res, next) => {
  try {
    const { pageType } = req.params;
    const stats = await Statistic.find({ landingPage: pageType });
    res.status(200).json({ success: true, count: stats.length, data: stats });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/public/partner-logos
 * @desc    Get partner logos, optionally filtered by category
 * @access  Public
 */
exports.getPartnerLogos = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const logos = await PartnerLogo.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: logos.length, data: logos });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/public/featured-startups
 * @desc    Get featured startups for Investor Landing Page
 * @access  Public
 */
exports.getFeaturedStartups = async (req, res, next) => {
  try {
    const startups = await FeaturedStartup.find({ featured: true }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .json({ success: true, count: startups.length, data: startups });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/public/success-stories
 * @desc    Get success stories, filtered by storyType and optionally featured
 * @access  Public
 */
exports.getSuccessStories = async (req, res, next) => {
  try {
    const { type, featured } = req.query;
    const query = {};
    if (type) query.storyType = type;
    if (featured !== undefined) query.featured = featured === "true";

    const stories = await SuccessStory.find(query).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: stories.length, data: stories });
  } catch (error) {
    next(error);
  }
};

const { contactEnquirySchema } = require("../utils/validators");
const ContactEnquiry = require("../models/ContactEnquiry");

/**
 * @route   POST /api/public/enquiries
 * @desc    Submit a contact enquiry (e.g., from the Company landing page)
 * @access  Public
 */
exports.createEnquiry = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = contactEnquirySchema.parse(req.body);

    // Save to database
    const enquiry = await ContactEnquiry.create(validatedData);

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    next(error);
  }
};

const path = require("path");
const fs = require("fs");

/**
 * @route   GET /api/public/documents/partnership-deck
 * @desc    Download the partnership deck document
 * @access  Public
 */
exports.downloadPartnershipDeck = async (req, res, next) => {
  try {
    // Using a dynamic placeholder approach. In the future, this can redirect to an S3 URL.
    const filePath = path.join(
      __dirname,
      "..",
      "assets",
      "partnership-deck.pdf",
    );

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    // Serve the dummy PDF file
    // Note: If migrating to cloud storage, replace with res.redirect('https://your-s3-bucket/partnership-deck.pdf')
    res.download(filePath, "BOCC-Partnership-Deck.pdf");
  } catch (error) {
    next(error);
  }
};
