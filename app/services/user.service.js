const { ObjectId } = require("mongodb");

class UserService {
  constructor(client) {
    this.Users = client.db().collection("Users");
  }

  extractUserData(payload) {
    const user = {
      name: payload.name,

      email: payload.email,
      password: payload.password,
    };
    // Them nguoi dung vao bang User
    Object.keys(user).forEach(
      (key) => user[key] === undefined && delete user[key]
    );

    return user;
  }
  async create(payload) {
    const user = this.extractUserData(payload);
    const result = await this.Users.findOneAndUpdate(
      user,
      {
        $set: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
      },
      { returnDocument: "after", upsert: true }
    );
    return result.value;
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async find(filter) {
    const cursor = await this.Users.find(filter);
    return await cursor.toArray();
  }

  async findUserById(id) {
    // Tim nguoi dung  theo id
    const user = await this.Users.findOne({ _id: new ObjectId(id) });
    return user;
  }

  async update(id, payload) {
    // Cap nhat thong tin nguoi dung
    const filter = { _id: new ObjectId(id) };
    const update = { $set: payload };
    const result = await this.Users.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });
    return result.value;
  }
  async delete(id) {
    const result = await this.Users.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }
  async deleteAll() {
    const result = await this.Users.deleteMany({});
    return result.deletedCount;
  }
  async login(email, password) {
    
    const user = await this.Users.findOne({ email });

    if (user) {
     
      if (user.password === password) {
        
        return user;
      } 
    } 
  }
}

module.exports = UserService;
