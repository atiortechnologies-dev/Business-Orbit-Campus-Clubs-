/**
 * @file chapterAssignment.js
 * @description Utility functions for assigning college chapters to students.
 * @architecture Helper module used during student registration to link them with appropriate campus chapters based on college names.
 */
const Chapter = require("../models/Chapter");

/**
 * Automatically assign a chapter to a student based on their college
 * @param {String} collegeName - The student's college name
 * @returns {Promise<Object>} Chapter object or null if not found
 */
const getChapterByCollege = async (collegeName) => {
  if (!collegeName || !collegeName.trim()) {
    return null;
  }

  try {
    // Find chapter by exact college name match (case-insensitive)
    const chapter = await Chapter.findOne({
      college_name: new RegExp(`^${collegeName.trim()}$`, "i"),
      status: "Active", // Only active chapters
    });

    return chapter || null;
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return null;
  }
};

/**
 * Assign chapter to student during registration
 * @param {String} collegeName - Student's college
 * @returns {Promise<ObjectId>} Chapter ID or null
 */
const assignChapterToStudent = async (collegeName) => {
  const chapter = await getChapterByCollege(collegeName);
  return chapter ? chapter._id : null;
};

/**
 * @desc    Exported chapter assignment utility functions
 * @route   N/A
 * @access  Internal
 */
module.exports = {
  getChapterByCollege,
  assignChapterToStudent,
};
