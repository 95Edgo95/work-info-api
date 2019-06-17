import * as bcrypt from "bcrypt-nodejs";

class AuthService {
  users = [
    {
      "id": 1,
      "username": "admin",
      "password": "$2a$08$40tt075Ii/KX/ncD1NfuIOcWt62j7POrgJ5YdzH00JEs4GuZApaTC",
      "role": "admin"
    },
    {
      "id": 2,
      "username": "user",
      "password": "$2a$08$DZuKdt1YWCk1MmKVOAyMOuMzFoRDHq3heviW0lOoIE5HeJlAzbfRG",
      "role": "viewer"
    }
  ];

  static validatePassword(dbPass: string, password: string): boolean {
    return bcrypt.compareSync(dbPass, password);
  }

  get() {
    return this.users;
  }

  find(username: string, password: string) {
    const users: any[] = this.get();

    const user = users.find(user => user.username === username);

    if (user && AuthService.validatePassword(password, user.password)) {
      return user;
    }

    return;
  }

  findById(id: number) {
    const users: any[] = this.get();

    return users.find(user => user.id === id);
  }
}

export default new AuthService();
