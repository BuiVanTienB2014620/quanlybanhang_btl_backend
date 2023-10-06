const { ObjectId } = require("mongodb");

class StaffService {
    constructor(client) {
        this.Staff = client.db().collection("Staffs");
    }

    extractStaffData(payload) {
        const staff = {
            MSNV: payload.MSNV,
            HoTenNV: payload.HoTenNV,
            Password: payload.Password,
            ChucVu: payload.ChucVu,
            DiaChi: payload.DiaChi,
            TrangThaiNV: payload.TrangThaiNV,
        };
        // Remove undefined fields
        Object.keys(staff).forEach(
            (key) => staff[key] === undefined && delete staff[key]
        );
        return staff;
    }

    async create(payload) {
        const staff = this.extractStaffData(payload);
        const result = await this.Staff.findOneAndUpdate(
            { MSNV: staff.MSNV },
            { $set: staff },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async findByMSNV(MSNV) {
        return await this.find({
            MSNV: { $regex: new RegExp(MSNV), $options: "i" },
        });
    }

    async find(filter) {
        const cursor = await this.Staff.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Staff.findOne({
            MSNV: id,
        });
    }

    async update(MSNV, payload) {
        const filter = {
            MSNV: MSNV,
        };
        const update = this.extractStaffData(payload);
        const result = await this.Staff.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(MSNV) {
        const result = await this.Staff.findOneAndDelete({
            MSNV: MSNV,
        });
        return result.value;
    }

    async deleteAll() {
        const result = await this.Staff.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = StaffService;
