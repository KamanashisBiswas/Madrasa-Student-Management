import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'bn';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Branding & Header
    appName: 'Al-Hikmah Madrasah',
    systemTitle: 'Madrasah ERP & Attendance Management System',

    // Public Navigation
    home: 'Home',
    about: 'About Us',
    teachers: 'Teachers',
    classes: 'Classes',
    notices: 'Notices',
    gallery: 'Gallery',
    contact: 'Contact',
    login: 'Portal Login',
    logout: 'Logout',
    dashboard: 'Dashboard',

    // Sidebar Items
    principalDashboard: 'Principal Dashboard',
    teacherManagement: 'Teacher Management',
    classManagement: 'Class & Sections',
    subjectManagement: 'Subject Management',
    studentDirectory: 'Student Directory',
    classAttendance: 'Class Attendance',
    smsLogs: 'SMS Logs',
    smsSettings: 'SMS Settings',
    auditTrail: 'Audit Trail',

    teacherDashboard: 'My Dashboard',
    takeAttendance: 'Take Attendance',
    assignedStudents: 'Assigned Students',

    // Statuses & Actions
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    excused: 'Excused',
    submitAttendance: 'Submit Attendance',
    confirmAttendance: 'Confirm Attendance',
    markAllPresent: 'Mark All Present',
    markAllAbsent: 'Mark All Absent',
    save: 'Save',
    cancel: 'Cancel',
    create: 'Create',
    edit: 'Edit',
    view: 'View',
    activate: 'Activate',
    deactivate: 'Deactivate',
    overrideStatus: 'Override Status',

    // KPI Cards & Headings
    totalStudents: 'Total Students',
    totalTeachers: 'Total Teachers',
    totalClasses: 'Total Classes',
    attendanceRate: 'Attendance Rate',
    smsSent: 'SMS Sent',
    smsFailed: 'SMS Failed',
    activeYear: 'Active Academic Year',
    recentActivity: 'Recent Attendance Activity',

    // Table Headers & Labels
    teacherId: 'Teacher ID',
    fullName: 'Full Name',
    designation: 'Designation',
    email: 'Email',
    mobile: 'Mobile',
    status: 'Status',
    actions: 'Actions',
    roll: 'Roll',
    studentId: 'Student ID',
    admissionNo: 'Admission No',
    bengaliName: 'Bengali Name',
    primaryGuardian: 'Primary Guardian',
    guardianMobile: 'Guardian Mobile',
    relationship: 'Relationship',
    section: 'Section',
    classTeacher: 'Class Teacher',
    subjectTeacher: 'Subject Teacher',
    subject: 'Subject',
    code: 'Code',
    date: 'Date',
    message: 'Message',
    attempts: 'Attempts',
    provider: 'Provider',
    timestamp: 'Timestamp',
    user: 'User',
    role: 'Role',

    // Buttons & Form Prompts
    addTeacher: 'Add New Teacher',
    createClass: 'Create New Class',
    assignClassTeacher: 'Assign Class Teacher',
    createSubject: 'Create Subject',
    assignSubjectTeacher: 'Assign Subject Teacher',
    registerStudent: 'Register New Student',
    viewProfile: 'View Profile',
    retryFailedSMS: 'Retry Failed SMS Queue',
    sendTestSMS: 'Dispatch Test Message',

    // Public Home Page Hero & Stats
    heroTitle: 'Excellence in Islamic Education & Real-Time Guardian Attendance',
    heroSubtitle: 'Integrating Hifz, Tajweed, Arabic Literature & Modern Curriculum with Automated Bengali SMS Notifications.',
    keyFeatures: 'Key Features & System Capabilities',
    feature1: 'Real-Time Rapid Attendance Entry for Teachers',
    feature2: 'Instant Decoupled SMS Notification to Primary Guardians',
    feature3: 'Separated Class Teacher & Subject Teacher Assignments',
    feature4: 'Multi-Year Academic History & Enrollment Tracking',
    feature5: 'Principal Attendance Overrides & Immutable Audit Logs',

    // Contact & Public Info
    contactUs: 'Get in Touch with Madrasah Administration',
    address: 'Address',
    phone: 'Phone',
    sendMsg: 'Send Message',
    yourName: 'Your Name',
    msgSubmitted: 'Your message has been sent successfully!',
  },

  bn: {
    // Branding & Header
    appName: 'আল-হিকমাহ আন্তর্জাতিক মাদ্রাসা',
    systemTitle: 'মাদ্রাসা ব্যবস্থাপনা ও ডিজিটাল উপস্থিতি সিস্টেম',

    // Public Navigation
    home: 'হোম',
    about: 'আমাদের সম্পর্কে',
    teachers: 'শিক্ষক মণ্ডলী',
    classes: 'শ্রেণি সমূহ',
    notices: 'নোটিশ বোর্ড',
    gallery: 'গ্যালারি',
    contact: 'যোগাযোগ',
    login: 'পোর্টাল লগইন',
    logout: 'লগআউট',
    dashboard: 'ড্যাশবোর্ড',

    // Sidebar Items
    principalDashboard: 'প্রিন্সিপাল ড্যাশবোর্ড',
    teacherManagement: 'শিক্ষক ব্যবস্থাপনা',
    classManagement: 'শ্রেণি ও সেকশন',
    subjectManagement: 'বিষয় ব্যবস্থাপনা',
    studentDirectory: 'ছাত্র ডিরেক্টরি',
    classAttendance: 'শ্রেণির উপস্থিতি',
    smsLogs: 'এসএমএস লগ',
    smsSettings: 'এসএমএস সেটিংস',
    auditTrail: 'অডিট ট্রেইল',

    teacherDashboard: 'আমার ড্যাশবোর্ড',
    takeAttendance: 'হাজিরা গ্রহণ',
    assignedStudents: 'আমার ক্লাসের ছাত্র',

    // Statuses & Actions
    present: 'উপস্থিত',
    absent: 'অনুপস্থিত',
    late: 'বিলম্ব',
    excused: 'ছুটি',
    submitAttendance: 'উপস্থিতি জমা দিন',
    confirmAttendance: 'উপস্থিতি নিশ্চিত করুন',
    markAllPresent: 'সবাই উপস্থিত',
    markAllAbsent: 'সবাই অনুপস্থিত',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    create: 'তৈরি করুন',
    edit: 'সম্পাদনা',
    view: 'দেখুন',
    activate: 'সক্রিয় করুন',
    deactivate: 'নিষ্ক্রিয় করুন',
    overrideStatus: 'স্ট্যাটাস পরিবর্তন',

    // KPI Cards & Headings
    totalStudents: 'মোট শিক্ষার্থী',
    totalTeachers: 'মোট শিক্ষক',
    totalClasses: 'মোট শ্রেণি',
    attendanceRate: 'উপস্থিতির হার',
    smsSent: 'এসএমএস প্রেরিত',
    smsFailed: 'এসএমএস ব্যর্থ',
    activeYear: 'বর্তমান শিক্ষাবর্ষ',
    recentActivity: 'সাম্প্রতিক উপস্থিতির বিবরণ',

    // Table Headers & Labels
    teacherId: 'শিক্ষক আইডি',
    fullName: 'পূর্ণ নাম',
    designation: 'পদবী',
    email: 'ইমেইল',
    mobile: 'মোবাইল নম্বর',
    status: 'অবস্থা',
    actions: 'অ্যাকশন',
    roll: 'রোল',
    studentId: 'ছাত্র আইডি',
    admissionNo: 'ভর্তি নম্বর',
    bengaliName: 'বাংলা নাম',
    primaryGuardian: 'প্রধান অভিভাবক',
    guardianMobile: 'অভিভাবকের নম্বর',
    relationship: 'সম্পর্ক',
    section: 'সেকশন',
    classTeacher: 'শ্রেণি শিক্ষক',
    subjectTeacher: 'বিষয় শিক্ষক',
    subject: 'বিষয়',
    code: 'কোড',
    date: 'তারিখ',
    message: 'বার্তা',
    attempts: 'চেষ্টা সংখ্যা',
    provider: 'প্রোভাইডার',
    timestamp: 'সময়',
    user: 'ব্যবহারকারী',
    role: 'রোল',

    // Buttons & Form Prompts
    addTeacher: 'নতুন শিক্ষক যুক্ত করুন',
    createClass: 'নতুন শ্রেণি তৈরি করুন',
    assignClassTeacher: 'শ্রেণি শিক্ষক নির্ধারণ করুন',
    createSubject: 'নতুন বিষয় যুক্ত করুন',
    assignSubjectTeacher: 'বিষয় শিক্ষক নির্ধারণ করুন',
    registerStudent: 'নতুন ছাত্র ভর্তি করুন',
    viewProfile: 'প্রোফাইল দেখুন',
    retryFailedSMS: 'ব্যর্থ এসএমএস পুনরায় পাঠান',
    sendTestSMS: 'টেস্ট বার্তা পাঠান',

    // Public Home Page Hero & Stats
    heroTitle: 'উচ্চমানের দ্বীনি শিক্ষা ও অভিভাবকের কাছে তাৎক্ষণিক হাজিরা নোটিফিকেশন',
    heroSubtitle: 'হিফজ, তাজবীদ ও আরবি সাহিত্যের সাথে আধুনিক সাধারণ শিক্ষা ও এসএমএস নোটিফিকেশন সিস্টেম।',
    keyFeatures: 'সিস্টেমের প্রধান বৈশিষ্ট্যসমূহ',
    feature1: 'শিক্ষকদের জন্য ১-ক্লিকে দ্রুত হাজিরা দেওয়ার সুবিধা',
    feature2: 'ছাত্র অনুপস্থিত থাকলে অভিভাবকের মোবাইলে সাথে সাথে বাংলা এসএমএস',
    feature3: 'শ্রেণি শিক্ষক এবং বিষয় শিক্ষকের আলাদা দায়িত্ব বণ্টন',
    feature4: 'বহু-বছরের শিক্ষাবর্ষ এবং ছাত্র ভর্তির ইতিহাস সংরক্ষণ',
    feature5: 'প্রিন্সিপাল কর্তৃক হাজিরা সংশোধন ও অডিট লগ সুবিধা',

    // Contact & Public Info
    contactUs: 'মাদ্রাসা প্রশাসনের সাথে যোগাযোগ করুন',
    address: 'ঠিকানা',
    phone: 'ফোন',
    sendMsg: 'বার্তা পাঠান',
    yourName: 'আপনার নাম',
    msgSubmitted: 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে!',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn'); // Default Bengali for Madrasah feel

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
