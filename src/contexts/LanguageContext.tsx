import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "id" | "zh";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

// Translation keys
const translations = {
    id: {},

    en: {
        // Auth
        email: "E-Mail",
        password: "Password",
        login: "Login",
        logout: "Logout",
        forgotPassword: "Forgot Password?",

        // Navigation
        home: "Home",
        recruitment: "Recruitment",
        sales: "Sales",
        employees: "Employees",
        profile: "Profile",

        // Recruitment
        resume: "Resume",
        approve: "Approve",
        reject: "Reject",
        experiences: "Experiences",
        expectedSalary: "Expected Salary",
        interviewScores: "Interview Scores",
        contactInformation: "Contact Information",
        genderAndAge: "Gender, Age",
        yearsOld: "years old",
        dateOfBirth: "Birth Date",
        phoneNumber: "Phone Number",
        identityCardAddress: "Identity Address",
        domisileAddress: "Domisile Address",
        ProfessionalInformation: "Professional Information",
        educations: "Educations",
        noEducationsAvailable: "No educations information available",
        workExperiences: "Work Experiences",
        noWorkExperiencesAvailable: "No work experiences information available",
        organizations: "Organizations",
        noOrganizationsAvailable: "No organizations information available",
        certificates: "Certificates",
        noCertificatesAvailable: "No certificates information available",
        skills: "Skills",
        noSkillsAvailable: "No skills information available",
        languages: "Languages",
        noLanguagesAvailable: "No languages information available",
        recruitmentReviews: "Recruitment Reviews",
        abilityScores: "Ability Scores",
        interviewNotes: "Interview Notes",
        approvedBy: "Approved by",
        at: "at",
        position: "Position",
        allPositions: "All Positions",
        clearAll: "Clear All",

        // Candidates
        candidates: "Candidates",
        confirm_approveCandidate: "Are you sure want to approve candidate?",
        confirm_rejectCandidate: "Are you sure want to reject candidate?",

        // Salaries
        salaries: "Salary Offers",
        confirm_approveSalary: "Are you sure want to approve salary offers?",
        confirm_rejectSalary: "Are you sure want to reject salary offers?",

        // Sales
        dailyQuotes: "Daily Quotes",
        pointOfSales: "Point of Sales",
        salesIn: "Sales In",
        salesInReports: "Sales In Reports",

        // Daily Quote
        recapDailyQuotes: "Recap Daily Quotes",
        allSales: "All Sales",
        supervisor: "Supervisor",
        allSupervisors: "All Supervisors",
        manager: "Manager",
        allManagers: "All Managers",
        newCustomers: "New Customers",
        existingCustomers: "Existing Customers",
        totalQuotations: "Total Quotations",
        newAmount: "New Amount",
        existingAmount: "Existing Amount",
        grandTotal: "Grand Total",
        record: "Record",
        records: "Records",
        quotes: "quotes",

        // Point of Sales
        million: "M",
        jan: "Jan",
        feb: "Feb",
        mar: "Mar",
        apr: "Apr",
        may: "May",
        jun: "Jun",
        jul: "Jul",
        aug: "Aug",
        sep: "Sep",
        oct: "Oct",
        nov: "Nov",
        dec: "Dec",
        ordersThisYear: "Orders this year",
        ordersToday: "Orders today",
        salesThisMonth: "Sales this month",
        salesThisYear: "Sales this year",
        sellingPerformanceThisYear: "Selling performance this year",
        listOfSalesIn: "List of Sales In",

        // Sales In
        paymentType: "Payment Type",
        allPaymentTypes: "All Payment Types",
        accountType: "Account Type",
        allAccountTypes: "All Account Types",

        // Sales In Report
        todaysIncome: "Today's Income",
        thisMonthsIncome: "This Month's Income",
        thisYearsIncome: "This Year's Income",
        completed: "Completed",
        inProgress: "In Progress",
        totalIncome: "Total Income",

        // Home
        welcome: "Welcome",
        dashboard: "Dashboard",
        quickActions: "Quick Actions",
        recentActivities: "Recent Activities",

        // Employees
        allEmployees: "All Employees",
        accessDoor: "Access Door",
        gpsView: "GPS View",

        // Profile
        emailAddress: "Email Address",
        officeLocation: "Office Location",
        accountSettings: "Account Settings",
        personalInformation: "Personal Information",
        notifications: "Notifications",
        privacyAndSecurity: "Privacy and Security",
        appPreferences: "App Preferences",
        support: "Support", // Or 'Help' depending on context
        contactSupport: "Contact Support",
        helpCenter: "Help Center",

        // Common
        search: "Search",
        noMoreData: "No more data available",
        noDataFound: "No data found",

        filter: "Filter",
        today: "Today",
        thisWeek: "This Week",
        thisMonth: "This Month",
        total: "Total",
        amount: "Amount",
        status: "Status",
        date: "Date",
        name: "Name",
        department: "Department",
        active: "Active",
        inactive: "Inactive",
        loading: "Loading...",
    },

    zh: {},
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") as Language;
        if (savedLanguage && ["en", "id", "zh"].includes(savedLanguage)) {
            setLanguage(savedLanguage);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const t = (key: string): string => {
        return translations[language][key as keyof (typeof translations)[typeof language]] || key;
    };

    return <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>{children}</LanguageContext.Provider>;
};
