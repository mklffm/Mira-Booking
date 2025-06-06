"use client";

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { sendReceiptEmail } from '@/lib/emailService';
import { useRouter } from 'next/navigation';

// Define translation type
type TranslationLanguage = 'en' | 'fr' | 'ar';
type VisaType = 'tourist' | 'business' | 'student';
type ProcessingTime = 'standard' | 'expedited' | 'urgent';

// Define types for form data
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  destination: string;
  travelDate: string;
  visaType: VisaType;
  processingTime: ProcessingTime;
  passportFile: File | null;
  agencyName: string;
  agencyId: string;
  clientNumber: string;
  bulkClientFile: File | null;
}

// Define props interface
interface SearchFormProps {
  language?: string;
}

// Translation object
const translations = {
  en: {
    formTitle: 'Check Your Visa Requirements',
    b2c: 'Individual',
    b2b: 'Travel Agency',
    b2cDescription: 'Apply for your visa directly with our easy-to-use form',
    b2bDescription: 'Get special rates for multiple visa applications',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    nationality: 'Nationality',
    destination: 'Destination',
    travelDate: 'Travel Date',
    visaType: 'Visa Type',
    tourist: 'Tourist Visa',
    business: 'Business Visa',
    student: 'Student Visa',
    processingTime: 'Processing Time',
    standard: 'Standard (7-10 days)',
    expedited: 'Expedited (3-5 days)',
    urgent: 'Urgent (24-48 hours)',
    passportUpload: 'Passport Scan',
    dragDrop: 'Drag and drop or click to upload',
    fileRequirements: 'PDF, JPG, JPEG, PNG (max. 5MB)',
    getQuote: 'Get Quote',
    agencyName: 'Agency Name',
    agencyId: 'Agency ID',
    bulkUpload: 'Bulk Client Upload',
    bulkUploadDescription: 'Upload multiple visa applications at once',
    clientNumber: 'Number of Clients',
    bulkRequirements: 'Excel or CSV file with client details',
    bulkTemplateDownload: 'Download template',
    importClients: 'Import Clients',
    priceTitle: 'Price Quote',
    priceDetails: 'Visa for',
    processingFee: 'Processing Fee',
    totalPrice: 'Total Amount',
    priceNote: 'Includes all processing fees and taxes',
    requiredDocuments: 'Required Documents',
    sendFilesInstructions: 'Send files to complete your application',
    applyNow: 'Apply Now',
    fileEmailNote: 'You can also email files to support@mira.dz',
    emailSent: 'Application submitted! Receipt sent to your email.',
    emailError: 'Error sending receipt. Please try again.',
    selectDestination: 'Select Destination',
    selectNationality: 'Select Nationality',
    // Placeholder translations
    fullNamePlaceholder: 'John Doe',
    emailPlaceholder: 'example@email.com',
    phonePlaceholder: '+213 555 123 456',
    agencyNamePlaceholder: 'Your Agency Name',
    agencyIdPlaceholder: 'If you have an existing ID',
    agencyEmailPlaceholder: 'agency@email.com',
    agencyPhonePlaceholder: '+213 555 123 456',
    optionalAgencyId: 'Optional if you\'re a new agency partner',
    sending: 'Sending...',
    clients: 'clients',
    available: 'Available',
    volumeDiscount: 'Volume Discount',
    currencyCode: 'DZD'
  },
  fr: {
    formTitle: 'Vérifiez vos conditions de visa',
    b2c: 'Individuel',
    b2b: 'Agence de voyage',
    b2cDescription: 'Demandez votre visa directement avec notre formulaire facile à utiliser',
    b2bDescription: 'Obtenez des tarifs spéciaux pour plusieurs demandes de visa',
    fullName: 'Nom complet',
    email: 'Adresse e-mail',
    phone: 'Numéro de téléphone',
    nationality: 'Nationalité',
    destination: 'Destination',
    travelDate: 'Date de voyage',
    visaType: 'Type de visa',
    tourist: 'Visa touristique',
    business: 'Visa d\'affaires',
    student: 'Visa étudiant',
    processingTime: 'Délai de traitement',
    standard: 'Standard (7-10 jours)',
    expedited: 'Accéléré (3-5 jours)',
    urgent: 'Urgent (24-48 heures)',
    passportUpload: 'Scan du passeport',
    dragDrop: 'Glisser-déposer ou cliquer pour télécharger',
    fileRequirements: 'PDF, JPG, JPEG, PNG (max. 5Mo)',
    getQuote: 'Obtenir un devis',
    agencyName: 'Nom de l\'agence',
    agencyId: 'ID de l\'agence',
    bulkUpload: 'Téléchargement groupé de clients',
    bulkUploadDescription: 'Téléchargez plusieurs demandes de visa à la fois',
    clientNumber: 'Nombre de clients',
    bulkRequirements: 'Fichier Excel ou CSV avec les détails des clients',
    bulkTemplateDownload: 'Télécharger le modèle',
    importClients: 'Importer des clients',
    priceTitle: 'Devis',
    priceDetails: 'Visa pour',
    processingFee: 'Frais de traitement',
    totalPrice: 'Montant total',
    priceNote: 'Comprend tous les frais de traitement et taxes',
    requiredDocuments: 'Documents requis',
    sendFilesInstructions: 'Envoyez des fichiers pour compléter votre demande',
    applyNow: 'Postulez maintenant',
    fileEmailNote: 'Vous pouvez également envoyer des fichiers à support@mira.dz',
    emailSent: 'Demande soumise ! Reçu envoyé à votre email.',
    emailError: 'Erreur d\'envoi du reçu. Veuillez réessayer.',
    selectDestination: 'Sélectionner une destination',
    selectNationality: 'Sélectionner une nationalité',
    // Placeholder translations
    fullNamePlaceholder: 'Jean Dupont',
    emailPlaceholder: 'exemple@email.com',
    phonePlaceholder: '+213 555 123 456',
    agencyNamePlaceholder: 'Nom de votre agence',
    agencyIdPlaceholder: 'Si vous avez un ID existant',
    agencyEmailPlaceholder: 'agence@email.com',
    agencyPhonePlaceholder: '+213 555 123 456',
    optionalAgencyId: 'Optionnel si vous êtes une nouvelle agence partenaire',
    sending: 'Envoi en cours...',
    clients: 'clients',
    available: 'Disponible',
    volumeDiscount: 'Remise sur Volume',
    currencyCode: 'DZD'
  },
  ar: {
    formTitle: 'تحقق من متطلبات التأشيرة الخاصة بك',
    b2c: 'فردي',
    b2b: 'وكالة سفر',
    b2cDescription: 'تقدم بطلب للحصول على تأشيرتك مباشرة باستخدام نموذجنا سهل الاستخدام',
    b2bDescription: 'احصل على أسعار خاصة لطلبات التأشيرات المتعددة',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    nationality: 'الجنسية',
    destination: 'الوجهة',
    travelDate: 'تاريخ السفر',
    visaType: 'نوع التأشيرة',
    tourist: 'تأشيرة سياحية',
    business: 'تأشيرة عمل',
    student: 'تأشيرة طالب',
    processingTime: 'وقت المعالجة',
    standard: 'قياسي (7-10 أيام)',
    expedited: 'مستعجل (3-5 أيام)',
    urgent: 'عاجل (24-48 ساعة)',
    passportUpload: 'مسح جواز السفر',
    dragDrop: 'اسحب وأفلت أو انقر للتحميل',
    fileRequirements: 'PDF، JPG، JPEG، PNG (بحد أقصى 5 ميجابايت)',
    getQuote: 'الحصول على عرض سعر',
    agencyName: 'اسم الوكالة',
    agencyId: 'معرف الوكالة',
    bulkUpload: 'تحميل العملاء بالجملة',
    bulkUploadDescription: 'قم بتحميل طلبات تأشيرة متعددة دفعة واحدة',
    clientNumber: 'عدد العملاء',
    bulkRequirements: 'ملف Excel أو CSV مع تفاصيل العميل',
    bulkTemplateDownload: 'تنزيل القالب',
    importClients: 'استيراد العملاء',
    priceTitle: 'عرض السعر',
    priceDetails: 'تأشيرة لـ',
    processingFee: 'رسوم المعالجة',
    totalPrice: 'المبلغ الإجمالي',
    priceNote: 'يشمل جميع رسوم المعالجة والضرائب',
    requiredDocuments: 'المستندات المطلوبة',
    sendFilesInstructions: 'أرسل الملفات لإكمال طلبك',
    applyNow: 'قدم الآن',
    fileEmailNote: 'يمكنك أيضًا إرسال الملفات إلى support@mira.dz',
    emailSent: 'تم تقديم الطلب! تم إرسال الإيصال إلى بريدك الإلكتروني.',
    emailError: 'خطأ في إرسال الإيصال. حاول مرة اخرى.',
    selectDestination: 'اختر الوجهة',
    selectNationality: 'اختر الجنسية',
    // Placeholder translations
    fullNamePlaceholder: 'محمد أحمد',
    emailPlaceholder: 'مثال@email.com',
    phonePlaceholder: '+213 555 123 456',
    agencyNamePlaceholder: 'اسم وكالتك',
    agencyIdPlaceholder: 'إذا كان لديك معرف موجود',
    agencyEmailPlaceholder: 'agency@email.com',
    agencyPhonePlaceholder: '+213 555 123 456',
    optionalAgencyId: 'اختياري إذا كنت وكالة شريكة جديدة',
    sending: 'جاري الإرسال...',
    clients: 'عميل',
    available: 'متاح',
    volumeDiscount: 'خصم الحجم',
    currencyCode: 'دج'
  }
};

// Processing times with fees
const processingTimes = {
  standard: { days: '7-10', fee: 0 },
  expedited: { days: '3-5', fee: 1500 },
  urgent: { days: '24-48', fee: 3000 }
};

// Required documents based on visa type
const requiredDocumentsMap = {
  tourist: [
    'Valid passport (minimum 6 months validity)',
    'Passport-sized photo with white background',
    'Hotel reservation confirmation',
    'Return flight ticket'
  ],
  business: [
    'Valid passport (minimum 6 months validity)',
    'Business invitation letter',
    'Company registration documents',
    'Hotel reservation confirmation',
    'Return flight ticket'
  ],
  student: [
    'Valid passport (minimum 6 months validity)',
    'Acceptance letter from educational institution',
    'Proof of financial means',
    'Accommodation details',
    'Return flight ticket'
  ]
};

// Add this array with the specified countries after the requiredDocumentsMap object
const destinationCountries = [
  'Canada',
  'USA',
  'France',
  'Spain',
  'Germany',
  'Belgium',
  'Austria',
  'UK',
  'Russia',
  'UAE',
  'Saudi Arabia',
  'Qatar',
  'Tunisia'
];

// Add this array with all countries in the world
const countriesList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
  "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", 
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", 
  "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", 
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", 
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", 
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", 
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", 
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", 
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", 
  "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", 
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", 
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", 
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", 
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", 
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", 
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", 
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", 
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", 
  "Zimbabwe"
];

export default function SearchForm({ language = 'en' }: SearchFormProps) {
  const router = useRouter();
  // Convert language prop to match TranslationLanguage type
  const currentLanguage = (language as TranslationLanguage) || 'en';
  const [accountType, setAccountType] = useState<'b2c' | 'b2b'>('b2c');
  const [showPrice, setShowPrice] = useState(false);
  const [customPrice, setCustomPrice] = useState(7500);
  const [requiredDocuments, setRequiredDocuments] = useState(requiredDocumentsMap.tourist);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  // Translation shorthand
  const t = translations[currentLanguage];
  
  // Form data
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    destination: '',
    travelDate: '',
    visaType: 'tourist',
    processingTime: 'standard',
    passportFile: null,
    agencyName: '',
    agencyId: '',
    clientNumber: '1',
    bulkClientFile: null
  });

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Update required documents when visa type changes
    if (name === 'visaType' && (value === 'tourist' || value === 'business' || value === 'student')) {
      setRequiredDocuments(requiredDocumentsMap[value]);
    }
    
    // Update price when processing time changes
    if (name === 'processingTime') {
      calculatePrice();
    }
    
    // Update price when client number changes for B2B
    if (name === 'clientNumber' && accountType === 'b2b') {
      calculatePrice();
    }
  };
  
  // Handle file uploads
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    
    const fieldName = e.target.name === 'passport-upload' ? 'passportFile' : 'bulkClientFile';
    
      setFormData({
        ...formData,
      [fieldName]: file
    });
  };
  
  // Calculate price based on selections
  const calculatePrice = () => {
    let basePrice = 7500; // Base price for standard processing
    
    // Add processing fee if expedited or urgent
    if (accountType === 'b2c') {
      const processingTime = formData.processingTime as ProcessingTime;
      basePrice += processingTimes[processingTime].fee;
    }
    
    // Apply discount for B2B with multiple clients
    if (accountType === 'b2b' && formData.clientNumber) {
      const clientCount = Number(formData.clientNumber);
      if (clientCount > 10) {
        basePrice = basePrice * 0.85; // 15% discount
      } else if (clientCount > 5) {
        basePrice = basePrice * 0.9; // 10% discount
      }
    }
    
    setCustomPrice(basePrice);
  };
  
  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    calculatePrice();
    setShowPrice(true);
  };
  
  // Get currency code based on language
  const getCurrencyCode = () => {
    return t.currencyCode;
  };

  // Handle apply now button click
  const handleApplyNow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEmailStatus('sending');
    
    // Clear previous email status
    localStorage.removeItem('emailSendStatus');
    
    // Create email data
    const emailData = {
      ...formData,
      accountType,
      price: customPrice,
      formattedPrice: `${customPrice.toLocaleString()} ${getCurrencyCode()}`
    };
    
    try {
      // Send receipt email
      const result = await sendReceiptEmail(emailData);
      
      // Store email status for debugging
      localStorage.setItem('emailSendStatus', JSON.stringify({
        timestamp: new Date().toISOString(),
        data: emailData,
        result: result,
      }));
      
      if (result.success) {
        console.log('Email success:', result.message);
        setEmailStatus('success');
        
        // Show guidance if in development mode
        if (result.message && result.message.includes('development')) {
          console.info('DEVELOPMENT MODE: Check /api/send-email in your browser to view the sent emails');
        }
        
        // Redirect to application page after a short delay
        setTimeout(() => {
          router.push('/demande-visa/success');
        }, 1500);
      } else {
        console.error('Email failed:', result.message);
        setEmailStatus('error');
      }
    } catch (error) {
      // Store error for debugging
      localStorage.setItem('emailSendStatus', JSON.stringify({
        timestamp: new Date().toISOString(),
        data: emailData,
        error: error instanceof Error ? error.message : String(error)
      }));
      
      console.error('Failed to send email:', error);
      setEmailStatus('error');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Account Type Toggle */}
      <div className="p-6 pb-0">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.b2c}
        </label>
        <div className="flex p-1 space-x-1 bg-gray-100 rounded-lg mb-6">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
              accountType === 'b2c' 
                ? 'bg-white shadow-md text-primary-600 transform translate-y-[-1px]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setAccountType('b2c')}
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{t.b2c}</span>
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
              accountType === 'b2b' 
                ? 'bg-white shadow-md text-primary-600 transform translate-y-[-1px]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setAccountType('b2b')}
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{t.b2b}</span>
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-primary-100 to-transparent rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-t from-secondary-100 to-transparent rounded-tr-full opacity-50"></div>

        <div className="p-6 relative z-10">
          <div className="flex items-center mb-6">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              {accountType === 'b2c' ? t.formTitle : 'Agency Client Import'}
      </h2>
          </div>
          
      {accountType === 'b2b' && (
            <p className="text-gray-600 mb-6 pl-16">{t.b2bDescription}</p>
      )}
      
          <form onSubmit={handleSubmit} className="transition-all duration-300">
        {accountType === 'b2c' ? (
          /* B2C Form - Individual Traveler Form */
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="form-group">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.fullName} <span className="text-red-500">*</span>
              </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder={t.fullNamePlaceholder}
                value={formData.fullName}
                onChange={handleChange}
                required
              />
                    </div>
            </div>
            
                  <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.email} <span className="text-red-500">*</span>
              </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
              <input
                type="email"
                id="email"
                name="email"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                required
              />
                    </div>
            </div>
            
                  <div className="form-group">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.phone} <span className="text-red-500">*</span>
              </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder={t.phonePlaceholder}
                value={formData.phone}
                onChange={handleChange}
                required
              />
                    </div>
            </div>
            
                  <div className="form-group">
                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.nationality} <span className="text-red-500">*</span>
              </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                      </div>
              <select
                id="nationality"
                name="nationality"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 appearance-none"
                value={formData.nationality}
                onChange={handleChange}
                required
              >
                <option value="" disabled>{t.selectNationality}</option>
                {countriesList.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
            </div>
            
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t.travelDate}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                        {t.destination} <span className="text-red-500">*</span>
              </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
              <select
                id="destination"
                name="destination"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 appearance-none"
                value={formData.destination}
                onChange={handleChange}
                required
              >
                <option value="" disabled>{t.selectDestination || 'Select Destination'}</option>
                {destinationCountries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
            </div>
            
                    <div className="form-group">
                      <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-2">
                        {t.travelDate} <span className="text-red-500">*</span>
              </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="date"
                          id="travelDate"
                          name="travelDate"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                          value={formData.travelDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="visaType" className="block text-sm font-medium text-gray-700 mb-2">
                        {t.visaType} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
              <select
                id="visaType"
                name="visaType"
                          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 appearance-none"
                value={formData.visaType}
                onChange={handleChange}
                required
              >
                <option value="tourist">{t.tourist}</option>
                <option value="business">{t.business}</option>
                <option value="student">{t.student}</option>
              </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
            </div>
            
                    <div className="form-group">
                      <label htmlFor="processingTime" className="block text-sm font-medium text-gray-700 mb-2">
                        {t.processingTime} <span className="text-red-500">*</span>
              </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
              <select
                id="processingTime"
                name="processingTime"
                          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 appearance-none"
                value={formData.processingTime}
                onChange={handleChange}
                required
              >
                <option value="standard">{t.standard}</option>
                <option value="expedited">{t.expedited}</option>
                <option value="urgent">{t.urgent}</option>
              </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
            
                {/* File Upload Section */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.passportUpload}
              </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="passport-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          <span>{t.dragDrop}</span>
              <input
                            id="passport-upload" 
                            name="passport-upload" 
                            type="file" 
                            className="sr-only" 
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        {t.fileRequirements}
                      </p>
                      {formData.passportFile && (
                        <p className="text-sm text-primary-600 mt-1">
                          {formData.passportFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-lg text-base font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-105"
                  >
                    {t.getQuote}
                    <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
            </div>
          </div>
        ) : (
          /* B2B Form - Agency Form */
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="form-group">
                    <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.agencyName} <span className="text-red-500">*</span>
              </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
              <input
                type="text"
                id="agencyName"
                name="agencyName"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder={t.agencyNamePlaceholder}
                value={formData.agencyName}
                onChange={handleChange}
                required
              />
                    </div>
            </div>
            
                  <div className="form-group">
                    <label htmlFor="agencyId" className="block text-sm font-medium text-gray-700 mb-2">
                {t.agencyId}
              </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
              <input
                type="text"
                id="agencyId"
                name="agencyId"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder={t.agencyIdPlaceholder}
                value={formData.agencyId}
                onChange={handleChange}
              />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{t.optionalAgencyId}</p>
            </div>
            
                  <div className="form-group">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.email} <span className="text-red-500">*</span>
              </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
              <input
                type="email"
                id="email"
                name="email"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder={t.agencyEmailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                required
              />
                    </div>
            </div>
            
                  <div className="form-group">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.phone} <span className="text-red-500">*</span>
              </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                        placeholder={t.agencyPhonePlaceholder}
                value={formData.phone}
                onChange={handleChange}
                required
              />
                    </div>
                  </div>
            </div>
            
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t.bulkUpload}
                  </h3>
                  <p className="text-gray-600 mb-4">{t.bulkUploadDescription}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-group">
                      <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                        {t.destination} <span className="text-red-500">*</span>
              </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
              <select
                id="destination"
                name="destination"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 appearance-none"
                value={formData.destination}
                onChange={handleChange}
                required
              >
                <option value="" disabled>{t.selectDestination || 'Select Destination'}</option>
                {destinationCountries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
            </div>
            
                    <div className="form-group">
                      <label htmlFor="clientNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        {t.clientNumber} <span className="text-red-500">*</span>
              </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
              <input
                type="number"
                id="clientNumber"
                name="clientNumber"
                min="1"
                          max="500"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                value={formData.clientNumber}
                onChange={handleChange}
                required
              />
                      </div>
                    </div>
            </div>
            
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-500 transition-colors duration-200">
                <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="bulk-client-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>{t.dragDrop}</span>
                      <input
                        id="bulk-client-upload"
                        name="bulk-client-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".csv,.xlsx,.xls"
                      />
                    </label>
                  </div>
                      <p className="text-xs text-gray-500">
                        {t.bulkRequirements}
                      </p>
                  {formData.bulkClientFile && (
                        <p className="text-sm text-primary-600 mt-1">
                          {formData.bulkClientFile.name}
                        </p>
                      )}
                      <div className="mt-2">
                        <a 
                          href="#" 
                          className="inline-flex items-center text-xs text-primary-600 hover:text-primary-500"
                        >
                          <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                          {t.bulkTemplateDownload}
                        </a>
                </div>
              </div>
            </div>
          </div>
        
                <div className="text-center">
          <button
            type="submit"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 w-full disabled:opacity-75 disabled:cursor-not-allowed"
          >
                    {t.importClients}
                    <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
          </button>
        </div>
              </div>
            )}
      
      {showPrice && (
              <div className="mt-10 transition-all duration-500 transform animate-fade-in">
                <div className="relative">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-t-lg"></div>
                  <div className="border border-gray-200 rounded-lg pt-8 pb-6 px-6 shadow-lg bg-white">
                    <div className="absolute -top-6 left-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-md shadow-md">
                      {t.priceTitle}
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 mb-5">
            <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {t.priceDetails} {formData.destination}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {accountType === 'b2c' ? (
                            <>
                              {formData.fullName} • {formData.nationality} • {
                                formData.visaType === 'tourist' ? t.tourist :
                                formData.visaType === 'business' ? t.business : t.student
                              }
                            </>
                          ) : (
                            <>
                              {formData.agencyName} • {formData.clientNumber} {t.clients}
                            </>
                          )}
                </p>
              </div>
                      <span className="bg-gradient-to-r from-green-50 to-teal-50 text-green-700 text-sm px-3 py-1 rounded-full border border-green-200 inline-flex items-center mt-2 md:mt-0">
                        <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {t.available}
                      </span>
            </div>
            
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.processingFee}</span>
                        <span className="text-gray-900 font-medium">{customPrice.toLocaleString()} {getCurrencyCode()}</span>
                      </div>
                      {accountType === 'b2c' && processingTimes[formData.processingTime].fee > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{
                            formData.processingTime === 'expedited' ? t.expedited :
                            formData.processingTime === 'urgent' ? t.urgent : ''
                          }:</span>
                          <span className="text-gray-900 font-medium">+{processingTimes[formData.processingTime].fee.toLocaleString()} {getCurrencyCode()}</span>
              </div>
            )}
                      {accountType === 'b2b' && Number(formData.clientNumber) > 5 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{t.volumeDiscount}:</span>
                          <span className="text-green-600 font-medium">-{
                            Number(formData.clientNumber) > 10 ? '15%' : '10%'
                          }</span>
              </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <div>
                        <div className="text-gray-900 font-bold text-xl">{t.totalPrice}</div>
                        <div className="text-gray-500 text-xs">{t.priceNote}</div>
              </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        {customPrice.toLocaleString()} {getCurrencyCode()}
            </div>
            </div>
            
                    <div className="mt-6 flex flex-col sm:flex-row justify-between">
                      <div className="mb-4 sm:mb-0 sm:mr-4">
                        <div className="text-sm font-semibold text-gray-900 mb-2">{t.requiredDocuments}</div>
                        <p className="text-sm text-gray-600 mb-2">{t.sendFilesInstructions}</p>
                        <p className="text-xs text-gray-500">{t.fileEmailNote}</p>
              </div>
                      <div className="flex-shrink-0 text-center">
              <button
                          onClick={handleApplyNow}
                          disabled={emailStatus === 'sending'}
                          className="inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 w-full disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                          {emailStatus === 'sending' ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {t.sending}
                            </span>
                          ) : emailStatus === 'success' ? (
                            <span className="flex items-center justify-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              {t.emailSent}
                            </span>
                          ) : emailStatus === 'error' ? (
                            <span className="flex items-center justify-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              {t.emailError}
                            </span>
                          ) : (
                            t.applyNow
                          )}
              </button>
                      </div>
                    </div>
            </div>
          </div>
        </div>
      )}
          </form>
        </div>
      </div>
    </div>
  );
} 