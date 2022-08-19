const ar = {
    translation: {
        ekram: {
            dead: {
                title: 'إكرام',
                hds: 'تكريم المتوفيين',
                deathDate: 'تاريخ الوفاة',
                deathTime: 'زمن الوفاة',
                deathDateFrom: 'تاريخ الوفاة من',
                deathDateTo: 'تاريخ الوفاة الى',
                deathReason: 'سبب الوفاة',
                square: 'رقم المربع',
                row: 'رقم الصف',
                column: 'رقم العمود',
                regNo: 'رقم القيد',
                add: 'إضافة سجل',
                delete: 'حذف السجل',
                type: 'السجل',
                deathCert: 'رفع شهادة وفاة',
                cemDetails: 'بيانات المقبرة',
                idLen: 'رقم الهوية يتكون من 10 أرقام',
                idPattern: 'يجب أن يبدأ رقم الهوية ب 1 او 2',
                edit: 'تعديل بيانات متوفي',
                graveLocation: 'موقع القبر',
                graveError: 'برجاء تحديد موقع القبر داخل حدود المقبرة',
            },
            cemeteries: {
                title: 'إدارة المقابر',
                name: 'اسم المقبرة',
                address: 'عنوان المقبرة',
                location: 'موقع المقبرة',
                add: 'إضافة مقبرة',
                edit: 'تعديل بيانات مقبرة',
                type: 'المقبرة',
                locationErr: 'برجاء تحديد الموقع باستخدام 4 نقاط على الأقل',
            },
        },
        accounts: {
            title: 'الحماية والمستخدمين',
            signIn: 'تسجيل الدخول',
            signOut: 'تسجيل الخروج',
            users: {
                title: 'إدارة المستخدمين',
                add: 'مستخدم جديد',
                resetPass: 'إعادة تعيين كلمة المرور',
                jobNo: 'الرقم الوظيفي',
                empType: 'نوع الموظف',
                job: 'الوظيفة',
                company: 'شركة',
                official: 'رسمي',
                search: 'ابحث بالاسم / رقم الهوية',
                edit: 'تعديل بيانات مستخدم',
                role: 'الدور الوظيفي',
                type: 'المستخدم',
                manager: 'المدير المباشر',
                companyAcc: 'حساب شركة ؟',
                companyName: 'اسم الشركة',
                accountData: 'بيانات الحساب',
                username: 'اسم المستخدم',
                password: 'كلمة المرور',
                passwordConfirm: 'تأكيد كلمة المرور',
                phoneLen: 'رقم الجوال يتكون من 12 رقم',
                idLen: 'رقم الهوية يتكون من 10 أرقام',
                idPattern: 'يجب أن يبدأ رقم الهوية ب 1 او 2',
                jobNoLen: 'الرقم الوظيفي يتكون من 8 رقم',
                passwordConfirmErr: 'لا يتطابق مع كلمة المرور',
            },
            permissions: {
                title: 'إدارة الصلاحيات',
                selected: 'تم اختيار',
                mainRole: 'الدور الوظيفي الأساسي',
                subRole: 'الدور الوظيفي الفرعي',
                department: 'القسم',
                page: 'الصفحة',
                addedPermissions: 'صلاحيات تمت اضافتها',
                permissionsToAdd: 'صلاحيات يمكنك اضافتها',
            },
            nationalities: {
                title: 'إدارة الجنسيات',
                add: 'إضافة جنسية',
                edit: 'تعديل جنسية',
                deleteConfirm: 'هل أنت متأكد من حذف الجنسية "{{data}}"',
            },
        },
        securityGuards: {
            title: 'أمني',
            locations: {
                title: 'إدارة المواقع',
                add: 'إضافة موقع',
                remainingLen: ' حرف متبقي',
                noLocationErr: 'الرجاء تحديد الموقع على الخريطة',
                edit: 'تعديل بيانات موقع',
                noShifts: 'لا يوجد فترات دوام محددة لهذا الموقع',
            },
            shifts: {
                title: 'الدوام',
                day: 'اختر يوماً',
                add: 'اضافة فترة دوام لموقع',
                deleteConfirm: 'هل أنت متأكد من حذف الفترة "{{shift}}" من "{{location}}"',
                edit: 'تعديل فترة دوام في "{{data}}"',
                shiftTime: 'من {{from}} - الى {{to}}',
            },
            shiftTimes: {
                title: 'فترات الدوام',
                add: 'إضافة فترة دوام',
                from: 'الفترة من',
                to: 'الفترة الى',
                timeErr: 'يجب أن يكون وقت نهاية الفترة أكبر من وقت البداية',
                edit: 'تعديل فترة دوام',
            },
        },
        common: {
            notFound: 'تعذر العثور على البيانات المطلوبة',
            sortBy: 'الترتيب حسب',
            name: 'الاسم',
            age: 'العمر',
            nat: 'الجنسية',
            type: 'النوع',
            filter: 'تصفية',
            deleteFilters: 'حذف التصفية',
            id: 'رقم الهوية',
            active: 'فعال',
            deleted: 'محذوف',
            location: 'الموقع',
            details: 'تفاصيل',
            edit: 'تعديل',
            delete: 'حذف',
            deleteConfirm: 'هل أنت متأكد من حذف بيانات "{{data}}" ؟',
            cancel: 'إلغاء',
            otherLang: 'En',
            years: 'سنة',
            months: 'أشهر',
            days: 'أيام',
            address: 'العنوان',
            status: 'الحالة',
            long: 'خط الطول',
            lat: 'خط العرض',
            order: 'الترتيب',
            yes: 'نعم',
            no: 'لا',
            asc: 'تصاعدي',
            desc: 'تنازلي',
            inactive: 'غير فعال',
            return: 'العودة',
            citizen: 'مواطن',
            success: {
                general: 'تمت العملية بنجاح',
                add: 'تمت الاضافة بنجاح',
                delete: 'تم الحذف بنجاح',
                edit: 'تم التعديل بنجاح',
            },
            error: {
                unknown: 'لقد حدث خطأ ما',
                unauthorized: 'ليس لديك صلاحية للقيام بهذه العملية',
                wrongCreds: 'تأكد من صحة البيانات',
            },
            openMenu: 'افتح القائمة',
            print: 'طباعة',
            activate: 'تفعيل',
            deactivate: 'إلغاء تفعيل',
            loading: 'جاري التحميل...',
            phone: 'رقم الجوال',
            email: 'البريد الالكتروني',
            arName: 'الاسم بالعربية',
            enName: 'الاسم بالانجليزية',
            save: 'حفظ',
            personalData: 'البيانات الشخصية',
            add: 'إضافة',
            gender: 'النوع',
            fileReady: 'تم تجهيز الملف',
            childAgeErr: 'يجب ان لا يتعدى عمر الطفل 15 عام',
            adultAgeErr: 'يجب ان لا يقل عمر البالغ عن 16 عام',
            extract: 'استخراج',
            search: 'ابحث',
            archive: 'أرشفة',
            restore: 'إستعادة',
            archiveConfirm: 'هل أنت متأكد من أرشفة بيانات "{{data}}" ؟',
            description: 'الوصف',
            day: 'اليوم',
            dashboard: 'الصفحة الرئيسية',
            settings: 'الإعدادات',
            mode: 'الوضع',
            contrast: 'التباين',
            direction: 'الإتجاه',
            layout: 'التصميم',
            presets: 'الألوان',
            stretch: 'إمتداد',
            fullScreen: 'كامل الشاشة',
            exitFullScreen: 'الحجم الطبيعي',
            noLocation: 'لم يتم تحديد موقع',
        },
    },
};

export default ar;
