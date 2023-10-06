
const { ObjectId } = require("mongodb");



class OrderService {
    constructor(client) {
        this.Order = client.db().collection("Orders");
    }
    //Dinh nghi cac phuong thuc truy xuat CSDL su dung mongodb APT
    extractOrderData(payload) {
        const order = {
           SoDonDH: payload.SoDonDH,
           MSKH: payload.MSKH,
           MSNV: payload.MSNV,
           NgayDH:new Date(),
           TrangThaiDH: payload.TrangThaiDH,
        };
        //remove undified fields
        Object.keys(order).forEach(
            (key) => order[key] === undefined && delete order[key]
        );
        return order;
    }

    async create(payload) {
        const order = this.extractOrderData(payload);
        const result = await this.Order.findOneAndUpdate(
            order,
            { $set: { TrangThaiDH: order.TrangThaiDH === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async findBySoDonDH(SoDonDH) {
        return await this.find({
            SoDonDH: { $regex: new RegExp(SoDonDH), $options: "i" },
        });
    }

    async find(filter) {
        const cursor = await this.Order.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Order.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractOrderData(payload);
        const result = await this.Order.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Order.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async findAllTrangThaiDH() {
        return await this.find({ TrangThaiDH: true });
    }

    async deleteAll() {
        const result = await this.Order.deleteMany({});
        return result.deletedCount;
    }
}



module.exports = OrderService;