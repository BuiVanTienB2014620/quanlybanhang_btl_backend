const { ObjectId } = require("mongodb");

class CustomerService {
    constructor(client) {
        this.Customer = client.db().collection("Customers");
    }

    extractCustomerData(payload) {
        const customer = {
            MSKH: payload.MSKH,
            HoTenKH: payload.HoTenKH,
            Password: payload.Password,
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai,
            TrangThaiKH: payload.TrangThaiKH,
        };
        // Remove undefined fields
        Object.keys(customer).forEach(
            (key) => customer[key] === undefined && delete customer[key]
        );
        return customer;
    }

    async create(payload) {
        const customer = this.extractCustomerData(payload);
        const result = await this.Customer.findOneAndUpdate(
            { MSKH: customer.MSKH },
            { $set: customer },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async findByMSKH(MSKH) {
        return await this.find({
            MSKH: { $regex: new RegExp(MSKH), $options: "i" },
        });
    }

    async find(filter) {
        const cursor = await this.Customer.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Customer.findOne({
            MSKH: id,
        });
    }

    async update(MSKH, payload) {
        const filter = {
            MSKH: MSKH,
        };
        const update = this.extractCustomerData(payload);
        const result = await this.Customer.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(MSKH) {
        const result = await this.Customer.findOneAndDelete({
            MSKH: MSKH,
        });
        return result.value;
    }

    async deleteAll() {
        const result = await this.Customer.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = CustomerService;
