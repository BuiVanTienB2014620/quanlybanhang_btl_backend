const { ObjectId } = require("mongodb");

class ImgCService {
    constructor(client) {
        this.ImgC = client.db().collection("ImgCs");
    }

    extractImgCData(payload) {
        const imgC = {
            MaHinh: payload.MaHinh,
            TenHinh: payload.TenHinh,
            MSHH: payload.MSHH,
        };
        // Remove undefined fields
        Object.keys(imgC).forEach(
            (key) => imgC[key] === undefined && delete imgC[key]
        );
        return imgC;
    }

    async create(payload) {
        const imgC = this.extractImgCData(payload);
        const result = await this.ImgC.findOneAndUpdate(
            { MaHinh: imgC.MaHinh },
            { $set: imgC },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async findByMaHinh(MaHinh) {
        return await this.find({
            MaHinh: { $regex: new RegExp(MaHinh), $options: "i" },
        });
    }

    async find(filter) {
        const cursor = await this.ImgC.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.ImgC.findOne({
            MaHinh: id,
        });
    }

    async update(MaHinh, payload) {
        const filter = {
            MaHinh: MaHinh,
        };
        const update = this.extractImgCData(payload);
        const result = await this.ImgC.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(MaHinh) {
        const result = await this.ImgC.findOneAndDelete({
            MaHinh: MaHinh,
        });
        return result.value;
    }

    async deleteAll() {
        const result = await this.ImgC.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = ImgCService;
