import * as pdfjs from "pdfjs-dist";
import workerPath from 'pdfjs-dist/build/pdf.worker.entry';
import { Document } from "docxyz";
pdfjs.GlobalWorkerOptions.workerSrc = workerPath;

export async function convertPDFToText(file) {
    try {
        let loadingPDF = pdfjs.getDocument(file);
        let pdf = await loadingPDF.promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            let page = await pdf.getPage(i);
            let content = await page.getTextContent();
            text += content.items.map(item => item.str).join(" ");
        }
        return text;
    }
    catch (error) {
        console.error(error);
    }
}

export async function convertDOCToText(file) {
    try {
        let document = new Document(file);
        let text = document.text;
        return text
    }
    catch (error) {
        console.error(error);
    }
}

export function convertHTMLToText(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            let textContent = reader.result;
            resolve(textContent);
        }
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    })
}

export async function extractFromFile(file) {
    let fileNameSplit = file.name.split(".");
    let extension = fileNameSplit[fileNameSplit.length - 1].toLowerCase().trim();
    if (extension === 'html') {
        return convertHTMLToText(file)
        .then(text => {
            const parser = new DOMParser();
            let tempDoc = parser.parseFromString(text, "text/html");
            tempDoc.body.innerHTML = tempDoc.body.innerHTML.replaceAll(">",">&nbsp");
            return(tempDoc.body.innerText);
        })
        .then(text => extractFromText(text));
    } else{
        return file.arrayBuffer()
        .then(buffer => {
            if (extension === 'pdf') {
                return convertPDFToText(buffer);
            } else if (extension === 'doc' || extension === 'docx') {
                return convertDOCToText(buffer);
            }
            else {
                throw new Error("file type is invalid!")
            }
        })
        .then(text => extractFromText(text));
    }
    
}

export async function extractFromText(textContent) {
    textContent = textContent.toString().toLowerCase();
    const fields = { domains: domainLibrary, skills: skillLibrary, provinces: provinceLibrary };
    let profile = {};
    for (let field of Object.keys(fields)) {
        profile[field] = new Array();
        for (let keyword of Object.keys(fields[field])) {
            for (let variant of fields[field][keyword]) {
                variant = variant.toLowerCase();
                variant = variant.replaceAll("+", "\\+");
                variant = variant.replaceAll(" ", "\\s+");
                let regrex = new RegExp("[\\s\\\\/;,\\.\\(\\):]" + variant + "[\\s\\\\/;,\\.\\(\\):]");
                if (textContent.search(regrex) >= 0) {
                    profile[field].push(keyword.trim());
                    break
                }
            }
        }
    }
    return profile;
}

const domainLibrary = {
    "Software": ["Software", "SW", "phan mem", "phần mềm"],
    "Web": ["Web", "website"],
    "Mobile": ["Mobile", "App", "Android", "IOS"],
    "Full-Stack": ["Full Stack", "FullStack", "Full-Stack"],
    "Front-end": ["Front End", "FrontEnd", "Front-end", "FE"],
    "Back-end": ["Back End", "BackEnd", "Back-end", "BE"],
    "Tester": ["Tester", "kiểm thử", "kiem thu"],
    "QA/QC": ["Quality Assurance", "Quality Control", "QA", "QC"],
    "Data Analyst": ["Data Analyst", "Data Analyst", "Data Analytic", "DA"],
    "Data Scientist": ["Data Scientist", "Data Science", "DS"],
    "Data Engineer": ["Data Engineer", "Big Data", "BigData", "du lieu lon", "dữ liệu lớn"],
    "Business Analyst": ["Business Analyst", "Business Analyst", "Business Analytic", "BA"],
    "Project Manager": ["Project Manager", "Project Management", "PM", "quản lý dự án", "quan ly du an", "quản trị dự án", "quan tri du an"],
    "Product Manager": ["Product Manager"],
    "Techlead": ["Techlead", "Teach lead", "Tech leader"],
    "Database Administrator": ["Database Administrator", "Database Admin", "Database Engineer", "DBA"],
    "System Engineer": ["System Administrator", "System Admin", "System Engineer"],
    "Network": ["Network", "mạng"],
    "Cybersecurity Analyst": ["Cybersecurity Analyst"],
    "DevOps": ["DevOps", "Ops"],
    "Cloud Architect": ["Cloud Architect"],
    "UI/UX": ["UI/UX", "UI", "UX"],
    "IT Manager": ["IT Manager"],
    "Sales Engineer": ["Sales Engineer"],
    "Solution Architect": ["Solution Architect"],
    "Infrastructure Engineer": ["Infrastructure"],
    "Machine Learning": ["Machine Learning", "ML"],
    "Deep Learning": ["Deep Learning", "DL"],
    "Artificial Intelligence Engineer": ["Artificial Intelligence Engineer"],
    "Robotics": ["Robotics", "Robot"],
    "Blockchain": ["Blockchain"],
    "IoT": ["IoT", "Internet of Things"],
    "Game": ["Game", "unity"],
    "Embedded": ["Embedded", "Embed", "Embedding", "lap trinh nhung", "lập trình nhúng"],
    "IT Help Desk": ["IT Help", "IT Support", "Helpdesk"],
    "AI": ["AI"]
}

const provinceLibrary = {
    "Hà Nội": ["Hà Nội", "Ha Noi", "HN"],
    "Hà Giang": ["Hà Giang", "Ha Giang"],
    "Cao Bằng": ["Cao Bằng", "Cao Bang"],
    "Bắc Kạn": ["Bắc Kạn", "Bac Kan"],
    "Tuyên Quang": ["Tuyên Quang", "Tuyen Quang"],
    "Lào Cai": ["Lào Cai", "Lao Cai"],
    "Điện Biên": ["Điện Biên", "Dien Bien"],
    "Lai Châu": ["Lai Châu", "Lai Chau"],
    "Sơn La": ["Sơn La", "Son La"],
    "Yên Bái": ["Yên Bái", "Yen Bai"],
    "Hoà Bình": ["Hoà Bình", "Hoa Binh"],
    "Thái Nguyên": ["Thái Nguyên", "Thai Nguyen"],
    "Lạng Sơn": ["Lạng Sơn", "Lang Son"],
    "Quảng Ninh": ["Quảng Ninh", "Quang Ninh"],
    "Bắc Giang": ["Bắc Giang", "Bac Giang"],
    "Phú Thọ": ["Phú Thọ", "Phu Tho"],
    "Vĩnh Phúc": ["Vĩnh Phúc", "Vinh Phuc"],
    "Bắc Ninh": ["Bắc Ninh", "Bac Ninh"],
    "Hải Dương": ["Hải Dương", "Hai Duong"],
    "Hải Phòng": ["Hải Phòng", "Hai Phong"],
    "Hưng Yên": ["Hưng Yên", "Hung Yen"],
    "Thái Bình": ["Thái Bình", "Thai Binh"],
    "Hà Nam": ["Hà Nam", "Ha Nam"],
    "Nam Định": ["Nam Định", "Nam Dinh"],
    "Ninh Bình": ["Ninh Bình", "Ninh Binh"],
    "Thanh Hóa": ["Thanh Hóa", "Thanh Hoa"],
    "Nghệ An": ["Nghệ An", "Nghe An"],
    "Hà Tĩnh": ["Hà Tĩnh", "Ha Tinh"],
    "Quảng Bình": ["Quảng Bình", "Quang Binh"],
    "Quảng Trị": ["Quảng Trị", "Quang Tri"],
    "Thừa Thiên Huế": ["Huế", "Thua Thien Hue"],
    "Đà Nẵng": ["Đà Nẵng", "Da Nang"],
    "Quảng Nam": ["Quảng Nam", "Quang Nam"],
    "Quảng Ngãi": ["Quảng Ngãi", "Quang Ngai"],
    "Bình Định": ["Bình Định", "Binh Dinh"],
    "Phú Yên": ["Phú Yên", "Phu Yen"],
    "Khánh Hòa": ["Khánh Hòa", "Khanh Hoa"],
    "Ninh Thuận": ["Ninh Thuận", "Ninh Thuan"],
    "Bình Thuận": ["Bình Thuận", "Binh Thuan"],
    "Kon Tum": ["Kon Tum", "Kon Tum"],
    "Gia Lai": ["Gia Lai", "Gia Lai"],
    "Đắk Lắk": ["Đắk Lắk", "Dak Lak"],
    "Đắk Nông": ["Đắk Nông", "Dak Nong"],
    "Lâm Đồng": ["Lâm Đồng", "Lam Dong"],
    "Bình Phước": ["Bình Phước", "Binh Phuoc"],
    "Tây Ninh": ["Tây Ninh", "Tay Ninh"],
    "Bình Dương": ["Bình Dương", "Binh Duong"],
    "Đồng Nai": ["Đồng Nai", "Dong Nai"],
    "Bà Rịa - Vũng Tàu": ["Bà Rịa", "Vũng Tàu", "Ba Ria", "Vung Tau"],
    "Thành phố Hồ Chí Minh": ["Hồ Chí Minh", "Ho Chi Minh", "HCM"],
    "Long An": ["Long An", "Long An"],
    "Tiền Giang": ["Tiền Giang", "Tien Giang"],
    "Bến Tre": ["Bến Tre", "Ben Tre"],
    "Trà Vinh": ["Trà Vinh", "Tra Vinh"],
    "Vĩnh Long": ["Vĩnh Long", "Vinh Long"],
    "Đồng Tháp": ["Đồng Tháp", "Dong Thap"],
    "An Giang": ["An Giang", "An Giang"],
    "Kiên Giang": ["Kiên Giang", "Kien Giang"],
    "Cần Thơ": ["Cần Thơ", "Can Tho"],
    "Hậu Giang": ["Hậu Giang", "Hau Giang"],
    "Sóc Trăng": ["Sóc Trăng", "Soc Trang"],
    "Bạc Liêu": ["Bạc Liêu", "Bac Lieu"],
    "Cà Mau": ["Cà Mau", "Ca Mau"],
    "nước ngoài": ["nước ngoài", "nuoc ngoai"]
}

const skillLibrary = {
    "Java": ["Java"],
    "Python": ["Python"],
    "JavaScript": ["JavaScript", "JS"],
    "Jquery": ["Jquery"],
    "C++": ["C++"],
    "C#": ["C#"],
    "PHP": ["PHP"],
    "Swift": ["Swift"],
    "Objective-C": ["Objective-C", "ObjectC"],
    "Ruby": ["Ruby"],
    "Kotlin": ["Kotlin"],
    "Go": ["Go"],
    "TypeScript": ["TypeScript"],
    "Scala": ["Scala"],
    "Shell script": ["Shell script"],
    "R": ["R"],
    "Perl": ["Perl"],
    "SQL": ["SQL", "MySQL", "SQLServer", "PostGreSQL", "Oracle", "RDBMS"],
    "NoSQL": ["NoSQL", "Mongo", "MongoDB", "hbase", "cassandra"],
    "HTML": ["HTML", "HTML5"],
    "CSS": ["CSS", "SASS"],
    "ReactJS": ["ReactJS", "React"],
    "ReactNative": ["ReactNative", "React Native"],
    "AngularJS": ["AngularJS", "Angular"],
    "VueJS": ["VueJS", "Vue"],
    "EmberJS": ["EmberJS", "Ember"],
    "BackboneJS": ["BackboneJS", "Backbone"],
    "NodeJS": ["NodeJS", "Node"],
    "Bootstrap": ["Bootstrap"],
    "Foundation": ["Foundation"],
    "Materialize CSS": ["Materialize CSS", "Materialize"],
    "Semantic UI": ["Semantic UI"],
    "Django": ["Django"],
    "Flask": ["Flask"],
    "ASP.NET": ["ASP.NET"],
    ".NET": [".NET", "NET"],
    "Laravel": ["Laravel"],
    "Symfony": ["Symfony"],
    "Spring": ["Spring"],
    "Hibernate": ["Hibernate"],
    "Wordpress": ["Wordpress"],
    "ExpressJS": ["ExpressJS", "Express"],
    "TensorFlow": ["TensorFlow"],
    "PyTorch": ["PyTorch"],
    "Keras": ["Keras"],
    "Hadoop": ["Hadoop"],
    "Spark": ["Spark"],
    "Kafka": ["Kafka"],
    "Visual Studio Code": ["Visual Studio Code", "VSC"],
    "IntelliJ": ["IntelliJ"],
    "Eclipse": ["Eclipse"],
    "NetBeans": ["NetBeans"],
    "PyCharm": ["PyCharm"],
    "Android Studio": ["Android Studio"],
    "Xcode": ["Xcode"],
    "Git": ["Git"],
    "GitHub": ["GitHub"],
    "Bitbucket": ["Bitbucket"],
    "Jenkins": ["Jenkins"],
    "Travis CI": ["Travis CI"],
    "Docker": ["Docker"],
    "Kubernetes": ["Kubernetes"],
    "Terraform": ["Terraform"],
    "AWS": ["AWS", "Amazon Web Service"],
    "Selenium": ["Selenium"],
    "Postman": ["Postman"],
    "Wireshark": ["Wireshark"],
    "Azure": ["Azure"],
    "microservice": ["microservice"],
    "unity": ["unity"],
    "BI": ["BI", "PowerBI", "Tableau"],
    "Scrum": ["Scrum"],
    "Agile": ["Agile"],
    "Data Warehouse": ["Data Warehouse", "DW"],
    "Data Lake": ["Data Lake"],
    "GraphQL": ["GraphQL"],
    "Ruby on Rails": ["Ruby on Rails"]
}
