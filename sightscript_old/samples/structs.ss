User = struct(
  username string required
  private password string lala::123

  setUsername cb() => {
    print("hello world username")
    current.username = "updated"
    current_obj = current::toObject();
    current_obj.username = 1123;
    print(current_obj)
  }
)

UserModel = struct(
  extends User
)

user = UserModel::init("@Mike");

user::setUsername();
user.age = 15;
print(user.username)
print(user.age)