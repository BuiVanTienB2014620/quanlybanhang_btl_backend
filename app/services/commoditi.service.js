const { ObjectId } = require("mongodb");

class CommodityService {
    constructor(client) {
        this.Commodities = client.db().collection("Commodities");
    }

    extractCommodityData(payload) {
        const commodity = {
            MSHH: payload.MSHH,
            TenHH: payload.TenHH,
            MoTaHH: payload.MoTaHH,
            Gia: payload.Gia,
            SoLuongHang: payload.SoLuongHang,
        };
        // Remove undefined fields
        Object.keys(commodity).forEach(
            (key) => commodity[key] === undefined && delete commodity[key]
        );
        return commodity;
    }

    async create(payload) {
        const commodity = this.extractCommodityData(payload);
        const result = await this.Commodities.findOneAndUpdate(
            { MSHH: commodity.MSHH },
            { $set: commodity },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async findByMSHH(MSHH) {
        return await this.find({
            MSHH: { $regex: new RegExp(MSHH), $options: "i" },
        });
    }

    async find(filter) {
        const cursor = await this.Commodities.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Commodities.findOne({
            MSHH: id,
        });
    }

    async update(MSHH, payload) {
        const filter = {
            MSHH: MSHH,
        };
        const update = this.extractCommodityData(payload);
        const result = await this.Commodities.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(MSHH) {
        const result = await this.Commodities.findOneAndDelete({
            MSHH: MSHH,
        });
        return result.value;
    }

    async deleteAll() {
        const result = await this.Commodities.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = CommodityService;
