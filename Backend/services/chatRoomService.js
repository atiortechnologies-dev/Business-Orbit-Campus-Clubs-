/**
 * @file chatRoomService.js
 * @description Service layer for chat room related database queries and aggregations.
 * @architecture Encapsulates complex MongoDB aggregations to keep controllers thin and focused on HTTP concerns.
 */

const ChatRoom = require("../models/ChatRoom");

/**
 * Gets hydrated chat rooms for a mentor, including student name, latest message, and unread count.
 * Optimizes MongoDB aggregations by strictly limiting sub-pipeline lookups instead of loading arrays into memory.
 *
 * @param {mongoose.Types.ObjectId} mentorId - The mentor's ID
 * @param {number|null} limit - Optional limit on the number of returned chats
 * @returns {Promise<Array>} Array of hydrated chat room objects
 */
exports.getHydratedChatRooms = async (mentorId, limit = null) => {
  const pipeline = [
    { $match: { mentor_id: mentorId } },
    {
      $lookup: {
        from: "users",
        localField: "student_id",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: "$student" },
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
                  { $eq: ["$is_read", false] },
                  { $ne: ["$sender_id", mentorId] },
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
      startupId: "$startup_id",
      studentName: "$student.full_name",
      startupName: "$startup.name",
      lastMessage: "$lastMessage.message",
      lastMessageTime: "$lastMessage.created_at",
      onlineStatus: "offline",
      unreadCount: "$unreadCount",
    },
  });

  return ChatRoom.aggregate(pipeline);
};
