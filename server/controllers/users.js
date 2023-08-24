import User from "../models/User.js";

// Read

export const getUser = async (req, res) => {
  try {
    console.log("chumma");
    const { id } = req.params;
    console.log("id", id);
    const user = await User.findById(id);
    console.log("user", user);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!Array.isArray(user.friends)) {
      return res.status(200).json([]); // Return empty array if no friends or invalid data
    }

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturepath }) => {
        return { _id, firstName, lastName, occupation, location, picturepath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

// update

export const addRemoveFriends = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (user.friends && friend.friends) {
      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter((id) => id !== friendId);
        friend.friends = friend.friends.filter((id) => id !== id);
      } else {
        user.friends.push(friendId);
        friend.friends.push(id);
      }
    }

    await user.save();
    await friend.save();

    if (user && user.friends && Array.isArray(user.friends)) {
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturepath }) => {
          return {
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturepath,
          };
        }
      );
      res.status(200).json(formattedFriends);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
