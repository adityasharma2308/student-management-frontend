const axios = require("axios");
const { faker } = require("@faker-js/faker");

const api = "http://localhost:5225/students";

const generateStudent = () => ({
  name: faker.person.fullName(),
  age: faker.number.int({ min: 5, max: 100 }),
});

const insertStudents = async (count) => {
  for (let i = 0; i < count; i++) {
    const student = generateStudent();
    try {
      await axios.post(api, student);
      console.log(`✅ Added: ${student.name}, Age: ${student.age}`);
    } catch (err) {
      console.error(`❌ Failed at record ${i + 1}`, err.message);
    }
  }

  console.log("✅ All done!");
};

insertStudents(1000);