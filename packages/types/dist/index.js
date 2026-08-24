"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintStatus = exports.ComplaintType = exports.DeliveryBatchStatus = exports.MealStatus = exports.BookingStatus = exports.MealType = exports.MealPlan = exports.ResidentStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["OWNER"] = "OWNER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["KITCHEN_STAFF"] = "KITCHEN_STAFF";
    UserRole["DELIVERY_STAFF"] = "DELIVERY_STAFF";
    UserRole["RESIDENT"] = "RESIDENT";
})(UserRole || (exports.UserRole = UserRole = {}));
var ResidentStatus;
(function (ResidentStatus) {
    ResidentStatus["ACTIVE"] = "ACTIVE";
    ResidentStatus["INACTIVE"] = "INACTIVE";
})(ResidentStatus || (exports.ResidentStatus = ResidentStatus = {}));
var MealPlan;
(function (MealPlan) {
    MealPlan["STANDARD"] = "STANDARD";
    MealPlan["LUNCH_ONLY"] = "LUNCH_ONLY";
    MealPlan["DINNER_ONLY"] = "DINNER_ONLY";
    MealPlan["CUSTOM"] = "CUSTOM";
})(MealPlan || (exports.MealPlan = MealPlan = {}));
var MealType;
(function (MealType) {
    MealType["LUNCH"] = "LUNCH";
    MealType["DINNER"] = "DINNER";
})(MealType || (exports.MealType = MealType = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["BOOKED"] = "BOOKED";
    BookingStatus["SKIPPED"] = "SKIPPED";
    BookingStatus["CANCELLED"] = "CANCELLED";
    BookingStatus["EXPIRED"] = "EXPIRED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var MealStatus;
(function (MealStatus) {
    MealStatus["BOOKED"] = "BOOKED";
    MealStatus["PREPARING"] = "PREPARING";
    MealStatus["PACKED"] = "PACKED";
    MealStatus["ASSIGNED"] = "ASSIGNED";
    MealStatus["DISPATCHED"] = "DISPATCHED";
    MealStatus["DELIVERED"] = "DELIVERED";
    MealStatus["CONFIRMED"] = "CONFIRMED";
    MealStatus["DISPUTED"] = "DISPUTED";
    MealStatus["INVESTIGATING"] = "INVESTIGATING";
    MealStatus["RESOLVED"] = "RESOLVED";
    MealStatus["CANCELLED"] = "CANCELLED";
})(MealStatus || (exports.MealStatus = MealStatus = {}));
var DeliveryBatchStatus;
(function (DeliveryBatchStatus) {
    DeliveryBatchStatus["CREATED"] = "CREATED";
    DeliveryBatchStatus["ASSIGNED"] = "ASSIGNED";
    DeliveryBatchStatus["DISPATCHED"] = "DISPATCHED";
    DeliveryBatchStatus["COMPLETED"] = "COMPLETED";
})(DeliveryBatchStatus || (exports.DeliveryBatchStatus = DeliveryBatchStatus = {}));
var ComplaintType;
(function (ComplaintType) {
    ComplaintType["MISSING_MEAL"] = "MISSING_MEAL";
    ComplaintType["WRONG_MEAL"] = "WRONG_MEAL";
    ComplaintType["DAMAGED_PACKAGING"] = "DAMAGED_PACKAGING";
    ComplaintType["LATE_DELIVERY"] = "LATE_DELIVERY";
    ComplaintType["QUALITY"] = "QUALITY";
    ComplaintType["OTHER"] = "OTHER";
})(ComplaintType || (exports.ComplaintType = ComplaintType = {}));
var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus["OPEN"] = "OPEN";
    ComplaintStatus["ASSIGNED"] = "ASSIGNED";
    ComplaintStatus["INVESTIGATING"] = "INVESTIGATING";
    ComplaintStatus["RESOLVED"] = "RESOLVED";
})(ComplaintStatus || (exports.ComplaintStatus = ComplaintStatus = {}));
