import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'bn';

const translations: Record<Language, Record<string, string>> = {
  en: {
    appName: 'Al-Hikmah Madrasah',
    systemTitle: 'Madrasah Management System',
    home: 'Home',
    about: 'About Us',
    principalMessage: "Principal's Message",
    teachers: 'Teachers',
    classes: 'Classes',
    notices: 'Notices',
    gallery: 'Gallery',
    admission: 'Admission',
    contact: 'Contact',
    login: 'Portal Login',
    dashboard: 'Dashboard',
    logout: 'Logout',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    excused: 'Excused',
    submitAttendance: 'Submit Attendance',
    confirmAttendance: 'Confirm Attendance',
    totalStudents: 'Total Students',
    totalTeachers: 'Total Teachers',
    totalClasses: 'Total Classes',
    attendanceRate: 'Attendance Rate',
    smsSent: 'SMS Sent',
    smsFailed: 'SMS Failed',
  },
  bn: {
    appName: 'আল-হিকমাহ মাদ্রাসা',
    systemTitle: 'মাদ্রাসা ব্যবস্থাপনা সিস্টেম',
    home: 'হোম',
    about: 'আমাদের সম্পর্কে',
    principalMessage: 'অধ্যক্ষের বাণী',
    teachers: 'শিক্ষক মণ্ডলী',
    classes: 'শ্রেণি সমূহ',
    notices: 'নোটিশ বোর্ড',
    gallery: 'গ্যালারি',
    admission: 'ভর্তি তথ্য',
    contact: 'যোগাযোগ',
    login: 'পোর্টাল লগইন',
    dashboard: 'ড্যাশবোর্ড',
    logout: 'লগআউট',
    present: 'উপস্থিত',
    absent: 'অনুপস্থিত',
    late: 'বিলম্ব',
    excused: 'ছুটি',
    submitAttendance: 'উপস্থিতি জমা দিন',
    confirmAttendance: 'উপস্থিতি নিশ্চিত করুন',
    totalStudents: 'মোট শিক্ষার্থী',
    totalTeachers: 'মোট শিক্ষক',
    totalClasses: 'মোট শ্রেণি',
    attendanceRate: 'উপস্থিতির হার',
    smsSent: 'এসএমএস প্রেরিত',
    smsFailed: 'এসএমএস ব্যর্থ',
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
