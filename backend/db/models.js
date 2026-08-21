import mongoose from "mongoose";

const { Schema } = mongoose;

const modelNames = [
  "Users",
  "UserProfile",
  "LearningGoal",
  "ProfilePrivacy",
  "ProfileView",
  "UserAvailability",
  "SavedFilter",
  "Skill",
  "UserSkill",
  "SkillPreview",
  "SwapRequest",
  "SwapClass",
  "ClassTodo",
  "PinnedResource",
  "CodeSnippet",
  "ClassroomFile",
  "SharedNote",
  "ChatRoom",
  "ChatMessage",
  "SwapCompletion",
  "SwapReview",
  "ReviewHelpfulVote",
  "UserReward",
  "Badge",
  "UserBadge",
  "Notification",
  "NotificationPreference",
  "PushSubscription",
  "CalendarReminderLog",
  "CalendarEvent",
  "Report",
  "BlockedUser",
  "AdminPenalty",
  "RefreshToken",
];

const refFields = new Set([
  "user",
  "profile",
  "learningGoals",
  "profilePrivacy",
  "profileViewsReceived",
  "profileViewsGiven",
  "userSkills",
  "sentRequests",
  "receivedRequests",
  "messages",
  "rewards",
  "badges",
  "notifications",
  "notificationPreference",
  "pushSubscriptions",
  "reminderLogs",
  "calendarEvents",
  "availability",
  "savedFilters",
  "reviewsGiven",
  "reviewsReceived",
  "reportsFiled",
  "reportsReceived",
  "penalties",
  "blockedUsers",
  "blockedByUsers",
  "helpfulReviewVotes",
  "refreshTokens",
  "skill",
  "preview",
  "swapRequest",
  "swapClass",
  "todos",
  "pinnedResources",
  "codeSnippets",
  "classroomFiles",
  "sharedNote",
  "chatRoom",
  "completion",
  "reviews",
  "calendarEvents",
  "creator",
  "uploader",
  "sender",
  "reviewer",
  "reviewee",
  "review",
  "badge",
  "calendarEvent",
  "blocker",
  "blockedUser",
]);

const schemaOptions = {
  strict: false,
  strictPopulate: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, result) => {
      delete result.__v;
      return result;
    },
  },
};

const schemas = {};
for (const name of modelNames) {
  const schema = new Schema({}, schemaOptions);
  schema.virtual("id").get(function getId() {
    return this._id.toString();
  });
  if (name === "Users") {
    schema.index({ email: 1 }, { unique: true });
    schema.index({ username: 1 }, { unique: true });
  }
  if (name === "UserSkill")
    schema.index({ userId: 1, skillId: 1, type: 1 }, { unique: true });
  if (name === "SwapRequest")
    schema.index({ fromUserId: 1, toUserId: 1, status: 1 });
  if (name === "SwapClass")
    schema.index({ swapRequestId: 1 }, { unique: true });
  if (name === "ChatRoom") schema.index({ swapClassId: 1 }, { unique: true });
  if (name === "RefreshToken") schema.index({ tokenId: 1 }, { unique: true });
  if (name === "BlockedUser")
    schema.index({ blockerId: 1, blockedUserId: 1 }, { unique: true });
  schemas[name] = mongoose.models[name] || mongoose.model(name, schema, name);
}

export const models = schemas;
const modelNameByDelegate = Object.fromEntries(
  modelNames.map((name) => [
    name.charAt(0).toLowerCase() + name.slice(1),
    name,
  ]),
);

export const getModel = (name) => {
  const canonicalName = modelNameByDelegate[name] || name;
  return (
    models[canonicalName] ||
    (models[canonicalName] = mongoose.model(
      canonicalName,
      new Schema({}, schemaOptions),
      canonicalName,
    ))
  );
};
export { refFields };
