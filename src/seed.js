const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Test = require('./models/Test');
const Result = require('./models/Result');
const School = require('./models/School');
const Resource = require('./models/Resource');

dotenv.config();

const seedData = async () => {
  try {
    // 1. Connect to Database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/virtual-kids-platform');
    console.log('Connected to MongoDB for seeding...');

    // 2. Clear Existing Data
    await User.deleteMany({});
    await Test.deleteMany({});
    await Result.deleteMany({});
    await School.deleteMany({});
    await Resource.deleteMany({});
    console.log('Cleared existing data.');

    // 3. Create Schools
    const schools = await School.insertMany([
      { name: 'Lincoln Elementary', address: '123 Main St', contactEmail: 'info@lincoln.edu' },
      { name: 'Washington Middle', address: '456 Oak Ave', contactEmail: 'admin@washington.edu' }
    ]);
    console.log('Created 2 Schools.');

    // 4. Create Password Hash
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 5. Create Users
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      schoolId: schools[0]._id
    });

    const teacher1 = await User.create({
      name: 'John Doe',
      email: 'teacher1@example.com',
      password: hashedPassword,
      role: 'teacher',
      status: 'active',
      schoolId: schools[0]._id
    });

    const teacher2 = await User.create({
      name: 'Jane Smith',
      email: 'teacher2@example.com',
      password: hashedPassword,
      role: 'teacher',
      status: 'active',
      schoolId: schools[1]._id
    });

    const students = [];
    for (let i = 1; i <= 5; i++) {
      const student = await User.create({
        name: `Student ${i}`,
        email: `student${i}@example.com`,
        password: hashedPassword,
        role: 'student',
        status: 'active',
        schoolId: i <= 3 ? schools[0]._id : schools[1]._id,
        studentClass: i <= 3 ? 'Grade 5' : 'Grade 6'
      });
      students.push(student);
    }
    console.log('Created Users: Admin, 2 Teachers, 5 Students.');

    // 6. Create Tests
    const test1 = await Test.create({
      title: 'HTML Basics',
      subject: 'HTML',
      duration: 30,
      createdBy: teacher1._id,
      questions: [
        {
          question: 'What does HTML stand for?',
          options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Model List', 'Home Tool Markup Language'],
          correctAnswer: 0
        },
        {
          question: 'Which tag is used for the largest heading?',
          options: ['<h6>', '<h1>', '<head>', '<header>'],
          correctAnswer: 1
        }
      ]
    });

    const test2 = await Test.create({
      title: 'CSS Flexbox Mastery',
      subject: 'CSS',
      duration: 45,
      createdBy: teacher1._id,
      questions: [
        {
          question: 'Which property is used to align items along the main axis?',
          options: ['align-items', 'justify-content', 'display-flex', 'flex-direction'],
          correctAnswer: 1
        }
      ]
    });

    const test3 = await Test.create({
      title: 'JavaScript Loops',
      subject: 'JavaScript',
      duration: 20,
      createdBy: teacher2._id,
      questions: [
        {
          question: 'Which loop is used to iterate over the properties of an object?',
          options: ['for', 'while', 'for...in', 'do...while'],
          correctAnswer: 2
        }
      ]
    });
    console.log('Created 3 Sample Tests.');

    // 7. Create Results for Students
    await Result.create({
      testId: test1._id,
      studentId: students[0]._id,
      score: 100,
      timeSpent: 300,
      answers: [
        { questionId: test1.questions[0]._id.toString(), answer: 0 },
        { questionId: test1.questions[1]._id.toString(), answer: 1 }
      ]
    });

    await Result.create({
      testId: test1._id,
      studentId: students[1]._id,
      score: 50,
      timeSpent: 450,
      answers: [
        { questionId: test1.questions[0]._id.toString(), answer: 0 },
        { questionId: test1.questions[1]._id.toString(), answer: 0 }
      ]
    });

    await Result.create({
      testId: test2._id,
      studentId: students[0]._id,
      score: 100,
      timeSpent: 600,
      answers: [
        { questionId: test2.questions[0]._id.toString(), answer: 1 }
      ]
    });

    console.log('Created Sample Results.');

    // 8. Create Resources
    await Resource.insertMany([
      { 
        title: 'HTML Basics: Building Your First Webpage', 
        category: 'HTML', 
        description: 'Learn the structural foundations of the web. Discover tags, elements, and how to create your first .html file!', 
        content: `
          <h2>Welcome to HTML!</h2>
          <p>HTML stands for <strong>HyperText Markup Language</strong>. It's the skeleton of every website you visit.</p>
          <p>Think of tags like buckets. You put content inside them to tell the browser what it is.</p>
          <ul>
            <li><code>&lt;h1&gt;</code> is for big headings.</li>
            <li><code>&lt;p&gt;</code> is for paragraphs of text.</li>
            <li><code>&lt;img&gt;</code> is for adding pictures!</li>
          </ul>
          <div class="bg-muted p-4 rounded-lg my-4">
            <h3 class="mt-0">Try this challenge:</h3>
            <p>Create a file called <code>index.html</code> and type: <code>&lt;h1&gt;Hello World&lt;/h1&gt;</code>.</p>
          </div>
        `,
        week: 1, 
        topic: 'Introduction to Tags',
        url: '#',
        type: 'link',
        status: 'active'
      },
      { 
        title: 'CSS Colors and Styles', 
        category: 'CSS', 
        description: 'Make your websites beautiful! Learn how to use CSS to add colors, fonts, and spacing.', 
        content: `
          <h2>Styling with CSS</h2>
          <p>CSS makes HTML look pretty. Without it, the web would be very plain text!</p>
          <p>You use <strong>selectors</strong> to target HTML elements and <strong>properties</strong> to change them.</p>
          <pre><code>h1 {
  color: blue;
  font-size: 40px;
}</code></pre>
          <p>Common properties include:</p>
          <ul>
            <li><code>background-color</code></li>
            <li><code>border-radius</code> (for rounded corners)</li>
            <li><code>padding</code> (for space inside boxes)</li>
          </ul>
        `,
        week: 1, 
        topic: 'Visual Styling',
        url: '#',
        type: 'document',
        status: 'active'
      },
      { 
        title: 'JavaScript: Making Things Interactive', 
        category: 'JavaScript', 
        description: 'The brain of your website. Learn how to handle button clicks and change things instantly!', 
        content: `
          <h2>JavaScript Power</h2>
          <p>JavaScript is a programming language that lets you create interactive content.</p>
          <p>With JS, you can respond to what the user does, like clicking a button or typing in a form.</p>
          <div class="bg-primary/10 p-4 border rounded">
            <code>alert("Welcome to my site!");</code>
          </div>
          <p>This simple line of code creates a popup box on the screen!</p>
        `,
        week: 1, 
        topic: 'Basic Scripting',
        url: '#',
        type: 'link',
        status: 'active'
      }
    ]);
    console.log('Created Sample Resources.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
