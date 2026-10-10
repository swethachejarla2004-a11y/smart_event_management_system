const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const VolunteerApplication = require('../models/VolunteerApplication');
const VolunteerAssignment = require('../models/VolunteerAssignment');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const Club = require('../models/Club');

dotenv.config({ path: __dirname + '/../.env' });

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    await VolunteerApplication.deleteMany({});
    await VolunteerAssignment.deleteMany({});
    await Attendance.deleteMany({});
    await Notification.deleteMany({});
    await Club.deleteMany({});

    console.log('Creating Admin & Organizer accounts...');
    
    // 1. Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@smartcampus.com',
      password: 'Password123!',
      role: 'admin',
      phone: '+1 800 555 0199',
      department: 'Administration',
      year: 'Faculty/Staff',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
    });

    // 2. Organizer
    const organizer = await User.create({
      name: 'Prof. Sarah Jenkins',
      email: 'organizer@smartcampus.com',
      password: 'Password123!',
      role: 'organizer',
      phone: '+1 800 555 0188',
      department: 'Computer Science & Engineering',
      year: 'Faculty Coordinator',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'
    });

    // 3. 10 Students
    const studentData = [
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@smartcampus.com',
        password: 'Password123!',
        role: 'student',
        department: 'Computer Science',
        year: '3rd Year',
        skills: ['Python', 'JavaScript', 'React', 'Machine Learning'],
        interests: ['AI', 'Coding', 'Hackathons'],
        preferredCategories: ['Technical', 'Workshops', 'Hackathons'],
        availability: ['Weekends', 'Saturday Morning', 'Flexible'],
        profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300'
      },
      {
        name: 'Maya Lin',
        email: 'maya.lin@smartcampus.com',
        password: 'Password123!',
        role: 'student',
        department: 'Information Technology',
        year: '4th Year',
        skills: ['Photography', 'Graphic Design', 'Public Relations', 'Photoshop'],
        interests: ['Art', 'Media', 'Cultural Events'],
        preferredCategories: ['Cultural', 'Workshops'],
        availability: ['Friday Afternoon', 'Weekends'],
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300'
      },
      {
        name: 'Rohan Sharma',
        email: 'rohan.sharma@smartcampus.com',
        password: 'Password123!',
        role: 'student',
        department: 'Data Science',
        year: '2nd Year',
        skills: ['Python', 'Data Analysis', 'SQL', 'Deep Learning'],
        interests: ['AI', 'Machine Learning', 'Data Visualization'],
        preferredCategories: ['Technical', 'Seminars'],
        availability: ['Weekdays Evening', 'Saturday Morning'],
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
      },
      {
        name: 'Sophia Patel',
        email: 'sophia.patel@smartcampus.com',
        password: 'Password123!',
        role: 'student',
        department: 'Business Administration',
        year: '3rd Year',
        skills: ['Event Management', 'Public Speaking', 'Marketing', 'Communication'],
        interests: ['Entrepreneurship', 'Leadership', 'Social Service'],
        preferredCategories: ['Management', 'Social Service', 'Seminars'],
        availability: ['Flexible', 'Weekends'],
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300'
      },
      {
        name: 'David Kim',
        email: 'david.kim@smartcampus.com',
        password: 'Password123!',
        role: 'student',
        department: 'Mechanical Engineering',
        year: '3rd Year',
        skills: ['Sports Management', 'First Aid', 'Logistics'],
        interests: ['Sports', 'Fitness', 'Outdoor Activities'],
        preferredCategories: ['Sports', 'Social Service'],
        availability: ['Saturday Morning', 'Sunday'],
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300'
      },
      {
        name: 'Emily Watson',
        email: 'emily.watson@smartcampus.com',
        password: 'Password123!',
        role: 'student',
        department: 'Cyber Security',
        year: '4th Year',
        skills: ['Ethical Hacking', 'Networking', 'Python', 'Linux'],
        interests: ['Cybersecurity', 'Coding', 'CTF Competitions'],
        preferredCategories: ['Technical', 'Hackathons'],
        availability: ['Weekends', 'Flexible'],
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300'
      },
      {
        name: 'Carlos Gomez',
        email: 'carlos.gomez@smartcampus.com',
        password: 'Password123!',
        role: 'student',
        department: 'Electrical Engineering',
        year: '1st Year',
        skills: ['Robotics', 'Arduino', 'C++'],
        interests: ['Hardware', 'Robotics', 'Quiz'],
        preferredCategories: ['Technical', 'Workshops'],
        availability: ['Friday Afternoon', 'Saturday Morning'],
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300'
      },
      {
        name: 'Ananya Roy',
        email: 'ananya.roy@smartcampus.com',
        password: 'Password123!',
        role: 'student',
        department: 'Media & Journalism',
        year: '2nd Year',
        skills: ['Video Editing', 'Content Writing', 'Social Media'],
        interests: ['Journalism', 'Photography', 'Music'],
        preferredCategories: ['Cultural', 'Seminars'],
        availability: ['Flexible'],
        profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300'
      },
      {
        name: 'James Wilson',
        email: 'james.wilson@smartcampus.com',
        password: 'Password123!',
        role: 'student',
        department: 'Civil Engineering',
        year: '3rd Year',
        skills: ['Anchor', 'Stage Management', 'Coordination'],
        interests: ['Cultural Fests', 'Drama', 'Debate'],
        preferredCategories: ['Cultural', 'Management'],
        availability: ['Weekends'],
        profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300'
      },
      {
        name: 'Priya Nair',
        email: 'priya.nair@smartcampus.com',
        password: 'Password123!',
        role: 'student',
        department: 'Biotechnology',
        year: '4th Year',
        skills: ['Medical Support', 'Volunteering', 'Registration Desk'],
        interests: ['Health', 'Social Causes', 'Blood Donation'],
        preferredCategories: ['Social Service', 'Seminars'],
        availability: ['Weekdays', 'Flexible'],
        profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800'
      }
    ];

    const students = await User.create(studentData);
    console.log(`Created ${students.length} students.`);

    // 4. 10 Events
    const now = new Date();
    const eventData = [
      {
        title: 'Smart Campus AI & ML Hands-on Workshop',
        description: 'Deep dive into practical Machine Learning models using Python and Scikit-Learn. Perfect for CS and Data Science students looking to build AI projects.',
        category: 'Technical',
        date: new Date(now.getTime() + 3 * 86400000),
        startTime: '10:00 AM',
        endTime: '04:00 PM',
        venue: 'Auditorium Hall A, Tech Block',
        organizer: organizer._id,
        maxParticipants: 150,
        requiredVolunteers: 6,
        requiredSkills: ['Python', 'Machine Learning', 'Data Analysis'],
        volunteerTasks: [
          { title: 'Registration Desk & Badge Distribution', description: 'Check student IDs and hand out workshop material.', requiredSkills: ['Communication', 'Registration Desk'], slotsNeeded: 2 },
          { title: 'Technical Support & Lab Setup', description: 'Assist participants with Python environment setup.', requiredSkills: ['Python', 'Technical Support'], slotsNeeded: 2 },
          { title: 'Photography & Event Documentation', description: 'Capture photos during sessions for campus newsletter.', requiredSkills: ['Photography'], slotsNeeded: 2 }
        ],
        registrationDeadline: new Date(now.getTime() + 2 * 86400000),
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
        status: 'published',
        qrCodeSecret: 'QR-EVENT-AI-WORKSHOP-2026'
      },
      {
        title: '24-Hour CodeSprint Hackathon 2026',
        description: 'Build innovative web & mobile applications to solve real campus problems. Win prizes, certificates, and mentorship from tech industry leaders!',
        category: 'Hackathons',
        date: new Date(now.getTime() + 7 * 86400000),
        startTime: '09:00 AM',
        endTime: '09:00 AM (Next Day)',
        venue: 'Main Innovation Center',
        organizer: organizer._id,
        maxParticipants: 200,
        requiredVolunteers: 10,
        requiredSkills: ['JavaScript', 'React', 'Python', 'Ethical Hacking'],
        volunteerTasks: [
          { title: 'Night Shift Desk & Refreshments Support', description: 'Manage snacks and maintain energy at night.', requiredSkills: ['Coordination'], slotsNeeded: 4 },
          { title: 'Judging Assistance & Time Keeping', description: 'Keep track of pitch timers and team queues.', requiredSkills: ['Public Speaking', 'Event Management'], slotsNeeded: 3 }
        ],
        registrationDeadline: new Date(now.getTime() + 5 * 86400000),
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        status: 'published',
        qrCodeSecret: 'QR-EVENT-HACKATHON-2026'
      },
      {
        title: 'Modern Full-Stack Web Development Bootcamp',
        description: 'Learn React, Node.js, Express, and MongoDB. Build responsive, high-performance applications from scratch.',
        category: 'Workshops',
        date: new Date(now.getTime() + 10 * 86400000),
        startTime: '02:00 PM',
        endTime: '06:00 PM',
        venue: 'Computer Lab 4',
        organizer: organizer._id,
        maxParticipants: 60,
        requiredVolunteers: 4,
        requiredSkills: ['JavaScript', 'React'],
        volunteerTasks: [
          { title: 'Lab Assistant', description: 'Help students troubleshoot code syntax errors.', requiredSkills: ['JavaScript'], slotsNeeded: 3 }
        ],
        registrationDeadline: new Date(now.getTime() + 9 * 86400000),
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800',
        status: 'published',
        qrCodeSecret: 'QR-EVENT-WEBDEV-2026'
      },
      {
        title: 'Annual Campus Cultural Fest: Rhythm 2026',
        description: 'Grand celebration featuring music concerts, dance battles, drama plays, and art exhibitions across the campus grounds.',
        category: 'Cultural',
        date: new Date(now.getTime() + 14 * 86400000),
        startTime: '05:00 PM',
        endTime: '11:00 PM',
        venue: 'Open Air Amphitheatre',
        organizer: organizer._id,
        maxParticipants: 1000,
        requiredVolunteers: 25,
        requiredSkills: ['Public Relations', 'Photography', 'Stage Management'],
        volunteerTasks: [
          { title: 'Stage Manager', description: 'Manage artist entries and stage props.', requiredSkills: ['Stage Management', 'Anchor'], slotsNeeded: 5 },
          { title: 'Media & Photography Lead', description: 'Direct event photos and live social media updates.', requiredSkills: ['Photography', 'Social Media'], slotsNeeded: 5 }
        ],
        registrationDeadline: new Date(now.getTime() + 12 * 86400000),
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        status: 'published',
        qrCodeSecret: 'QR-EVENT-CULTURAL-2026'
      },
      {
        title: 'Inter-Department Sports Meet 2026',
        description: 'Cricket, Football, Basketball, Track & Field events. Support your department and compete for the prestigious trophy!',
        category: 'Sports',
        date: new Date(now.getTime() + 18 * 86400000),
        startTime: '08:00 AM',
        endTime: '05:00 PM',
        venue: 'Campus Sports Ground',
        organizer: organizer._id,
        maxParticipants: 500,
        requiredVolunteers: 15,
        requiredSkills: ['Sports Management', 'First Aid'],
        volunteerTasks: [
          { title: 'Scorekeeper & Field Marshal', description: 'Record scores and maintain ground order.', requiredSkills: ['Sports Management'], slotsNeeded: 8 },
          { title: 'First Aid & Hydration Desk', description: 'Provide water and basic first aid to athletes.', requiredSkills: ['First Aid', 'Medical Support'], slotsNeeded: 4 }
        ],
        registrationDeadline: new Date(now.getTime() + 15 * 86400000),
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        status: 'published',
        qrCodeSecret: 'QR-EVENT-SPORTS-2026'
      },
      {
        title: 'Mega Campus Blood Donation Drive',
        description: 'Join hands with Red Cross Society to donate blood and save lives. Free health check-up, juice, and certificates provided for all donors.',
        category: 'Social Service',
        date: new Date(now.getTime() + 5 * 86400000),
        startTime: '09:00 AM',
        endTime: '03:00 PM',
        venue: 'Student Activity Center',
        organizer: organizer._id,
        maxParticipants: 300,
        requiredVolunteers: 12,
        requiredSkills: ['Medical Support', 'Volunteering', 'Registration Desk'],
        volunteerTasks: [
          { title: 'Donor Registration & Form Assistance', description: 'Fill donor verification forms.', requiredSkills: ['Registration Desk'], slotsNeeded: 4 },
          { title: 'Post-Donation Care & Refreshments', description: 'Assist donors with rest and beverages.', requiredSkills: ['Medical Support', 'Volunteering'], slotsNeeded: 5 }
        ],
        registrationDeadline: new Date(now.getTime() + 4 * 86400000),
        image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800',
        status: 'published',
        qrCodeSecret: 'QR-EVENT-BLOOD-2026'
      },
      {
        title: 'Campus Startup Summit & Pitch Contest',
        description: 'Pitch your business ideas to venture capitalists and angel investors. Win seed capital funding up to $10,000!',
        category: 'Management',
        date: new Date(now.getTime() + 21 * 86400000),
        startTime: '10:00 AM',
        endTime: '05:00 PM',
        venue: 'Executive Seminar Hall',
        organizer: organizer._id,
        maxParticipants: 150,
        requiredVolunteers: 8,
        requiredSkills: ['Event Management', 'Marketing', 'Public Speaking'],
        volunteerTasks: [
          { title: 'VIP Guest Escort & Hospitality', description: 'Welcome judges and venture capitalists.', requiredSkills: ['Public Speaking', 'Marketing'], slotsNeeded: 4 }
        ],
        registrationDeadline: new Date(now.getTime() + 19 * 86400000),
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
        status: 'published',
        qrCodeSecret: 'QR-EVENT-STARTUP-2026'
      },
      {
        title: 'National Technical Quiz Championship',
        description: 'Test your knowledge in Science, Engineering, History of Computing, and Current Tech Trends.',
        category: 'Technical',
        date: new Date(now.getTime() + 8 * 86400000),
        startTime: '02:30 PM',
        endTime: '05:30 PM',
        venue: 'Auditorium Hall B',
        organizer: organizer._id,
        maxParticipants: 120,
        requiredVolunteers: 5,
        requiredSkills: ['C++', 'Python'],
        volunteerTasks: [
          { title: 'Buzzer System & Scoreboard Controller', description: 'Operate electronic quiz buzzers and screen graphics.', requiredSkills: ['Technical Support'], slotsNeeded: 2 }
        ],
        registrationDeadline: new Date(now.getTime() + 6 * 86400000),
        image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800',
        status: 'published',
        qrCodeSecret: 'QR-EVENT-QUIZ-2026'
      },
      {
        title: 'ShutterBug Campus Photography Contest',
        description: 'Capture the essence of college life through your lens. Top photos will be featured in the annual magazine and campus gallery.',
        category: 'Cultural',
        date: new Date(now.getTime() + 12 * 86400000),
        startTime: '11:00 AM',
        endTime: '04:00 PM',
        venue: 'Art Gallery & Campus Quad',
        organizer: organizer._id,
        maxParticipants: 80,
        requiredVolunteers: 4,
        requiredSkills: ['Photography', 'Photoshop'],
        volunteerTasks: [
          { title: 'Gallery Curator & Photo Assessor', description: 'Mount submissions on exhibit boards.', requiredSkills: ['Photography'], slotsNeeded: 2 }
        ],
        registrationDeadline: new Date(now.getTime() + 11 * 86400000),
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        status: 'published',
        qrCodeSecret: 'QR-EVENT-PHOTO-2026'
      },
      {
        title: 'Spring Tech Expo & Project Showcase',
        description: 'Exhibition of final year engineering innovation projects across Robotics, AI, IoT, Renewable Energy, and Mobile Apps.',
        category: 'Seminars',
        date: new Date(now.getTime() + 25 * 86400000),
        startTime: '09:30 AM',
        endTime: '04:30 PM',
        venue: 'Convention Center',
        organizer: organizer._id,
        maxParticipants: 400,
        requiredVolunteers: 10,
        requiredSkills: ['Robotics', 'Python', 'Communication'],
        volunteerTasks: [
          { title: 'Stall Coordinator', description: 'Guide visitors and industry evaluators to project booths.', requiredSkills: ['Communication'], slotsNeeded: 5 }
        ],
        registrationDeadline: new Date(now.getTime() + 22 * 86400000),
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        status: 'published',
        qrCodeSecret: 'QR-EVENT-EXPO-2026'
      }
    ];

    const events = await Event.create(eventData);
    console.log(`Created ${events.length} events.`);

    // 5. Clubs
    const clubData = [
      {
        name: 'Smart Campus Coding & AI Club',
        description: 'Premier student technical community dedicated to competitive programming, machine learning, and open-source software engineering.',
        category: 'Technical',
        coordinator: students[0]._id,
        members: [students[0]._id, students[2]._id, students[5]._id, students[6]._id],
        logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300',
        banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
      },
      {
        name: 'Photography & Creative Arts Guild',
        description: 'Community of visual storytellers, photographers, filmmakers, and digital artists across all campus departments.',
        category: 'Cultural',
        coordinator: students[1]._id,
        members: [students[1]._id, students[7]._id],
        logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300',
        banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'
      },
      {
        name: 'Social Service & Red Cross Student Wing',
        description: 'Driven by empathy and social responsibility, organizing health camps, blood drives, and environmental sustainability initiatives.',
        category: 'Social Service',
        coordinator: students[9]._id,
        members: [students[3]._id, students[4]._id, students[9]._id],
        logo: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=300',
        banner: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800'
      }
    ];

    const clubs = await Club.create(clubData);
    console.log(`Created ${clubs.length} clubs.`);

    // 6. Sample Registrations & Volunteer Applications
    console.log('Generating registrations, volunteer apps & sample attendance...');

    // Alex Rivera registers for AI Workshop & Hackathon
    await Registration.create({
      student: students[0]._id,
      event: events[0]._id,
      status: 'registered',
      ticketCode: 'TKT-ALEX-AI01'
    });
    await Registration.create({
      student: students[0]._id,
      event: events[1]._id,
      status: 'registered',
      ticketCode: 'TKT-ALEX-HACK'
    });

    // Maya Lin applies as volunteer for Cultural Fest
    await VolunteerApplication.create({
      student: students[1]._id,
      event: events[3]._id,
      preferredTask: 'Media & Photography Lead',
      skills: ['Photography', 'Graphic Design'],
      availability: ['Weekends'],
      notes: 'I have my own DSLR camera and coverage experience.',
      status: 'approved'
    });

    await VolunteerAssignment.create({
      volunteer: students[1]._id,
      event: events[3]._id,
      task: 'Media & Photography Lead',
      assignedBy: organizer._id,
      instructions: 'Please report to the main amphitheatre control booth at 4:30 PM.'
    });

    // Rohan Sharma registers for AI Workshop & sample attendance
    await Registration.create({
      student: students[2]._id,
      event: events[0]._id,
      status: 'attended',
      ticketCode: 'TKT-ROHAN-AI'
    });

    await Attendance.create({
      student: students[2]._id,
      event: events[0]._id,
      attendanceStatus: 'present',
      verificationCode: 'ATT-ROHAN-PASS'
    });

    // Notifications
    await Notification.create({
      user: students[0]._id,
      title: 'Welcome to Smart Campus! 🎓',
      message: 'Explore recommended events matched to your Python and AI interests.',
      type: 'info'
    });

    await Notification.create({
      user: students[1]._id,
      title: 'Volunteer Application Approved! 🎉',
      message: 'Your volunteer application for Rhythm 2026 has been approved by Prof. Sarah Jenkins.',
      type: 'volunteer'
    });

    console.log('\n=========================================================');
    console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('=========================================================');
    console.log('Demo Credentials:');
    console.log('🔑 ADMIN:     admin@smartcampus.com    / Password123!');
    console.log('🔑 ORGANIZER: organizer@smartcampus.com / Password123!');
    console.log('🔑 STUDENT:   alex.rivera@smartcampus.com / Password123!');
    console.log('=========================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
