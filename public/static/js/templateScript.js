document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const user = JSON.parse(params.get("user"));
    const lang = params.get("lang");
    const htmlTemp = document.getElementById("template");
    document.title = lang === "ar" ? user.NameFl : user.NameSl;
    // const texts = document.querySelectorAll("p");
    // texts.forEach((text) => {
    //     console.log(text);
    //     text.innerHTML = text.innerText.replace(/\s/g, "\u00a0");
    // });
    const template = Handlebars.compile(htmlTemp.outerHTML);

    const data = {
        name: lang === "ar" ? user.NameFl : user.NameSl,
        email: user.Email,
        username: user.Username,
        job: lang === "ar" ? user.SecurityUserJobNameFl : user.SecurityUserJobNameSl,
        id: user.NationalNumber,
        manager: user.managerName,
        phone: user.Mobile,
        jobNo: user.JobNumber,
        isCompany: user.IsCompany,
        isActive: user.IsActive,
        companyName: user.CompanyName,
        roles: user.SecurityRoleList,
    };
    const filledTemplate = template(data);
    htmlTemp.outerHTML = filledTemplate;

    html2pdf()
        .from(filledTemplate)
        .set({
            margin: 0,
            image: { type: "jpeg", quality: 1 },
            filename: `${lang === "ar" ? user.NameFl : user.NameSl}.pdf`,
            html2canvas: { scale: 5, dpi: 192 },
            pagebreak: "css",
            jsPDF: { orientation: "portrait", unit: "pt", format: "A4", compressPDF: true },
        })
        .save();

    // const opt = {
    //     margin: [0, 0, 0, 0],
    //     filename: `${user.NameFl}.pdf`,
    //     image: { type: "jpeg", quality: 1 },
    //     dir: "rtl",
    //     html2canvas: {
    //         dpi: 192,
    //         scale: 4,
    //         letterRendering: true,
    //         useCORS: true,
    //     },
    //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    // };
    // html2pdf(filled, opt);
});
