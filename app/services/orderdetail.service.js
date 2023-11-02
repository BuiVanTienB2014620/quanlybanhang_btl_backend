const { ObjectId } = require("mongodb");

class OrderDetailService {
    constructor(client) {
        this.OrderDetail = client.db().collection("OrderDetails");
       
    }

    extractOrderDetailData(payload) {
        const orderDetail = {
            SoDonDH: payload.SoDonDH,
            MSHH: payload.MSHH,
            SoLuong: payload.SoLuong,
            GiaDatHang: payload.GiaDatHang,
            GiamGia: payload.GiamGia,
        };
        // Remove undefined fields
        Object.keys(orderDetail).forEach(
            (key) => orderDetail[key] === undefined && delete orderDetail[key]
        );
        return orderDetail;
    }

    async create(payload) {
        const orderDetail = this.extractOrderDetailData(payload);
        const result = await this.OrderDetail.findOneAndUpdate(
            orderDetail,
            { $set: { GiamGia: orderDetail.GiamGia === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    // async findBySoDonDH(SoDonDH) {
    //     return await this.find({
    //         SoDonDH: { $regex: new RegExp(SoDonDH), $options: "i" },
    //     });
    // }

    async find(filter) {
        const cursor = await this.OrderDetail.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.OrderDetail.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractOrderDetailData(payload);
        const result = await this.OrderDetail.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.OrderDetail.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async deleteAll() {
        const result = await this.OrderDetail.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = OrderDetailService;
