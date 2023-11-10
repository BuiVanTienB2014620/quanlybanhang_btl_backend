const { ObjectId } = require("mongodb");

class ProductService {
  constructor(client) {
    this.Products = client.db().collection("HangHoa");
  }

  extractProductData(payload) {
    const product = {
      TenHH: payload.TenHH,
      MoTaHH: payload.MoTaHH,
      Gia: payload.Gia,
      SoLuongHangHoa: payload.SoLuongHangHoa,
      GhiChu: payload.GhiChu,
    };

    // Remove undefined fields
    Object.keys(product).forEach(
      (key) => product[key] === undefined && delete product[key]
    );

    return product;
  }

  async create(payload) {
    const product = this.extractProductData(payload);
    const result = await this.Products.insertOne(product, {
      returnDocument: "after",
      upsert: true,
    });
    return result.value;
  }

  async findByTenHH(TenHH) {
    return await this.find({
      TenHH: { $regex: new RegExp(TenHH), $options: "i" },
    });
  }

  async find(filter) {
    const cursor = await this.Products.find(filter);
    return await cursor.toArray();
  }

  async findProductById(id) {
    const product = await this.Products.findOne({ _id: new ObjectId(id) });
    return product;
  }

  async update(id, payload) {
    const filter = { _id: new ObjectId(id) };
    const update = { $set: this.extractProductData(payload) };
    const result = await this.Products.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });
    return result.value;
  }

  async delete(id) {
    const result = await this.Products.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async deleteAll() {
    const result = await this.Products.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = ProductService;
