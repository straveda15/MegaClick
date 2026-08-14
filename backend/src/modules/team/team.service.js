import EmployeeProfile from "./team.model.js";
import User from "../user/user.model.js";

class TeamService {
  async createEmployee(data, creatorId) {
    const { userId, managerId } = data;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if profile already exists
    const existingProfile = await EmployeeProfile.findOne({ userId });
    if (existingProfile) {
      throw new Error("Employee profile already exists for this user");
    }

    // Check if manager exists if provided
    if (managerId) {
      const manager = await User.findById(managerId);
      if (!manager) {
        throw new Error("Manager not found");
      }
    }

    // Generate readable employee ID (EMP-001, EMP-002, etc.)
    const count = await EmployeeProfile.countDocuments();
    const employeeId = `EMP-${(count + 1).toString().padStart(3, "0")}`;

    const profile = await EmployeeProfile.create({
      ...data,
      employeeId,
      createdBy: creatorId,
      updatedBy: creatorId,
    });

    return profile;
  }

  async getAllEmployees() {
    return await EmployeeProfile.find({ isDeleted: { $ne: true } })
      .populate("userId", "name lastName email phone role departmentRole isSalesManager operationalRoles allowedPaths isActive")
      .populate("managerId", "name lastName email")
      .sort({ createdAt: -1 });
  }

  async getEmployeeById(id) {
    const profile = await EmployeeProfile.findOne({ _id: id, isDeleted: { $ne: true } })
      .populate("userId", "name lastName email phone role departmentRole isSalesManager operationalRoles allowedPaths isActive")
      .populate("managerId", "name lastName email");
    
    if (!profile) {
      throw new Error("Employee profile not found");
    }
    return profile;
  }

  async updateEmployee(id, data, updaterId) {
    const profile = await EmployeeProfile.findByIdAndUpdate(
      id,
      { ...data, updatedBy: updaterId },
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new Error("Employee profile not found");
    }
    return profile;
  }

  async updateStatus(id, status, updaterId) {
    const profile = await EmployeeProfile.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { status, updatedBy: updaterId },
      { new: true }
    );

    if (!profile) {
      throw new Error("Employee profile not found");
    }
    return profile;
  }

  async softDeleteEmployee(id, updaterId) {
    const profile = await EmployeeProfile.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), updatedBy: updaterId },
      { new: true }
    );

    if (!profile) {
      throw new Error("Employee profile not found");
    }
    return profile;
  }

  async getHierarchy() {
    // Basic hierarchy logic: Return all managers and their subordinates
    const all = await EmployeeProfile.find({ isDeleted: { $ne: true } })
      .populate("userId", "name lastName")
      .populate("managerId", "name lastName");
    
    return all;
  }
}

export default new TeamService();
