import hotel1 from "../assets/hotel1.jpg";
import hotel2 from "../assets/hotel2.jpg";
import hotel3 from "../assets/hotel3.jpg";

export const rooms = [
  {
    id: "single-room",
    name: "Single Room",
    price: 1200,
    maxGuests: 2,
    availableRooms: 8,
    image: hotel2,
    description:
      "Comfortable room with modern amenities and a relaxing atmosphere.",
  },
  {
    id: "executive-room",
    name: "Executive Room",
    price: 2000,
    maxGuests: 4,
    availableRooms: 5,
    image: hotel1,
    description:
      "Spacious room designed for business travelers and families.",
  },
  {
    id: "luxury-suite",
    name: "Luxury Suite",
    price: 2600,
    maxGuests: 5,
    availableRooms: 3,
    image: hotel3,
    description:
      "Premium suite offering elegance, comfort, and extra space.",
  },
];

export function getRoomById(roomId) {
  return rooms.find((room) => room.id === roomId) || rooms[0];
}
