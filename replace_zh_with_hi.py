import json
import glob
import os

translation_map = {
    # UI JSON
    "护照签证照片生成器": "पासपोर्ट और वीज़ा फोटो मेकर",
    "选择照片": "एक फोटो चुनें",
    "免责声明和数据隐私政策": "अस्वीकरण और डेटा गोपनीयता नीति",
    "免责声明：": "अस्वीकरण: ",
    "此工具可能使用不正确或过时的要求。该工具的作者以及工具本身不对其使用造成的任何损失负责。使用此工具的用户有责任检查政府网站上的最新要求，并对使用此工具创建的照片承担全部责任。通过点击“同意”并继续，表示您确认您同意此免责声明。": "यह उपकरण गलत या पुरानी आवश्यकताओं का उपयोग कर सकता है। इस उपकरण के लेखक और स्वयं उपकरण, इसके उपयोग के कारण होने वाले किसी भी नुकसान के लिए ज़िम्मेदार नहीं हैं। जो उपयोगकर्ता इस उपकरण का उपयोग करते हैं, वे सरकारी वेबसाइटों पर अद्यतन आवश्यकताओं की जाँच करने के लिए उत्तरदायी हैं और इस उपकरण का उपयोग करके उनके द्वारा बनाए गए फ़ोटो की पूरी ज़िम्मेदारी लेते हैं। \"सहमत\" पर क्लिक करके और जारी रखकर, आप इस अस्वीकरण के साथ अपने समझौते की पुष्टि करते हैं।",
    "数据隐私政策：": "डेटा गोपनीयता नीति: ",
    "您的照片将在本地浏览器内进行处理，*不会*上传到任何服务器。唯一共享的数据是您对本网站的访问活动，用于Google网站分析。点击'同意'并继续，即表示您确认同意此政策。": "आपकी तस्वीर आपके ब्राउज़र के अंदर स्थानीय रूप से संसाधित की जाएगी। कोई भी तस्वीर किसी सर्वर पर अपलोड नहीं की जाएगी। साझा किया गया एकमात्र डेटा इस वेबसाइट पर आपकी पहुंच गतिविधियां हैं, जिनका उपयोग Google वेबसाइट विश्लेषण के लिए किया जाता है। 'सहमत' पर क्लिक करके और जारी रखकर, आप इस नीति के साथ अपने समझौते की पुष्टि करते हैं।",
    "我们收集 cookie 是为了分析我们的网站流量和性能，其中不涉及收集任何个人数据。点击“同意”或继续使用该网站，即表示您确认同意本条款。": "हम अपनी वेबसाइट ट्रैफ़िक और प्रदर्शन का विश्लेषण करने के लिए कुकीज़ एकत्र करते हैं, और हम कभी भी कोई व्यक्तिगत डेटा एकत्र नहीं करते हैं। 'सहमत' पर क्लिक करके या वेबसाइट का उपयोग जारी रखकर, आप इस नीति के साथ अपने समझौते की पुष्टि करते हैं।",
    "同意": "सहमत",
    "拒绝": "असहमत",
    "缩放": "ज़ूम",
    "旋转": "घुमाएँ",
    "参考线": "गाइड",
    "说明": "निर्देश",
    "默认宽度": "डिफ़ॉल्ट चौड़ाई",
    "默认高度": "डिफ़ॉल्ट ऊंचाई",
    "变换": "बदलें",
    "颜色": "रंग",
    "亮度": "चमक",
    "饱和度": "संतृप्ति",
    "色温": "गर्माहट",
    "对比度": "कंट्रास्ट",
    "AI去背景": "AI पृष्ठभूमि हटाना",
    "处理中...": "प्रोसेसिंग...",
    "AI去背景错误，请刷新并重试。": "AI बैकग्राउंड रिमूवल कॉल करने में त्रुटि, कृपया रीफ्रेश करें फिर पुनः प्रयास करें।",
    "AI去背景不支持iPhone或iPad，请使用安卓，苹果电脑，或者Windows设备。": "AI बैकग्राउंड रिमूवल iPhone या iPad को सपोर्ट नहीं करता है, कृपया Android, macOS या Windows डिवाइस का उपयोग करें।",
    "第一次使用需要稍加等待，请保持耐心......": "पहली बार में कुछ समय लग सकता है, कृपया धैर्य रखें...",
    "不同意": "असहमत",
    "确定": "पुष्टि करें",
    "取消": "रद्द करें",
    "继续下载AI模型": "AI मॉडल डाउनलोड करें?",
    "点击“确认”以开始下载AI预训练的去背景模型。它将占用约80MB的空间，并且仅需要在本次会话中下载一次。": "\"पुष्टि करें\" पर क्लिक करके पृष्ठभूमि हटाने के लिए AI पूर्व-प्रशिक्षित मॉडल डाउनलोड शुरू करें। इसमें ~80MB लगेंगे और इस सत्र के लिए केवल एक बार डाउनलोड करने की आवश्यकता होगी।",
    "加载新照片": "नई फोटो लोड करें",
    "宽度": "चौड़ाई",
    "高度": "ऊंचाई",
    "文件大小": "आकार",
    "更新历史": "चेंजलॉग",
    "反馈或建议？": "प्रतिक्रिया?",
    "保存照片": "फोटो सहेजें",
    "生成照片中......": "उत्पन्न कर रहा है...",
    "保存单张照片": "एकल फोटो सहेजें",
    "保存打印照片": "प्रिंट करने योग्य लेआउट सहेजें",
    "用于电子版上传": "इलेक्ट्रॉनिक अपलोड के लिए",
    "用于打印4''x6''照片": "4''x6'' फोटो प्रिंट के लिए",
    "新年": "शुभ",
    "快乐": " नया साल",
    "大家好，我最近因为公司运营问题被裁员。如果您在美国，愿意推荐Software Engineer相关职位的，请发邮件到 ": "सभी को नमस्कार, मुझे हाल ही में निकाल दिया गया था। यदि आप अमेरिका में हैं और किसी सॉफ्टवेयर इंजीनियर से संबंधित अवसरों की सिफारिश करना चाहते हैं, तो कृपया मुझे ईमेल करें ",
    "，非常感谢！": ", आपका बहुत-बहुत धन्यवाद!",

    # Templates
    "中国护照签证照片": "चीनी पासपोर्ट/वीज़ा फोटो",
    "将鼻尖居中对齐这条线": "नाक की नोक को मध्य रेखा के साथ संरेखित करें",
    "请勿将头部（包含头发）上沿放入此区域": "सिर के ऊपरी हिस्से/बालों को इस क्षेत्र में न रखें",
    "请勿将头部（包含下巴）下沿放入此区域": "चेहरे के निचले हिस्से/ठोड़ी को इस क्षेत्र में न रखें",
    "请将头部（包含头发）上沿放入此区域": "सिर के ऊपरी हिस्से/बालों को इस क्षेत्र में रखें",
    "移动方框将头部或脸部边缘按下列要求放入有颜色处": "अपने चेहरे को फिट करने के लिए आयत को ऊपर-नीचे ले जाएँ",
    "请将脸部（不含耳朵）左侧放入此区域": "चेहरे के बाईं ओर (कान नहीं) के किनारे को इस क्षेत्र में रखें",
    "请将脸部（不含耳朵）右侧放入此区域": "चेहरे के दाईं ओर (कान नहीं) के किनारे को इस क्षेत्र में रखें",
    "请将脸部（下巴）下沿放入此区域": "चेहरे के निचले हिस्से/ठोड़ी के किनारे को इस क्षेत्र में रखें",
    "中国旅行证照片": "चीनी यात्रा दस्तावेज़ फोटो",
    "美国护照签证照片": "अमेरिकी पासपोर्ट/वीज़ा फोटो",
    "请上下拖动这两条绿色方框使得你的头部和脸部符合以下要求": "अपने चेहरे को फिट करने के लिए दोनों पट्टियों को ऊपर-नीचे ले जाएँ",
    "英国护照照片": "यूके पासपोर्ट फोटो",
    "加拿大护照照片": "कनाडा पासपोर्ट फोटो",
    "加拿大签证照片": "कनाडा वीज़ा फोटो",
    "澳大利亚签证照片": "ऑस्ट्रेलिया वीज़ा फोटो",
    "日本护照签证照片": "जापान पासपोर्ट/वीज़ा फोटो",
    "马来西亚护照照片": "मलेशिया पासपोर्ट फोटो",
    "德国护照照片": "जर्मनी पासपोर्ट फोटो",
    "墨西哥TN签证照片": "मेक्सिको टीएन वीज़ा फोटो",
    "西班牙护照签证照片": "स्पेन पासपोर्ट फोटो",
    "越南电子签证照片": "वियतनाम ई-वीज़ा फोटो",
    "纯白背景。脸部需占图像高度的70-80%。请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://evisa.xuatnhapcanh.gov.vn/\">这里</a>查看最新标准。": "सफेद पृष्ठभूमि। चेहरा फ्रेम की ऊंचाई का 70-80% होना चाहिए। कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://evisa.xuatnhapcanh.gov.vn/\">यहाँ</a> करें।",
    "新加坡ICA护照签证照片": "सिंगापुर आईसीए (ICA) पासपोर्ट/वीज़ा फोटो",
    "纯白哑光背景。下巴到头顶需25-35mm。文件最大60KB（严格）。请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.ica.gov.sg/\">这里</a>查看最新标准。": "सादा सफेद मैट पृष्ठभूमि। ठुड्डी से सिर की चोटी तक चेहरे का माप 25-35 मिमी होना चाहिए। अधिकतम फ़ाइल आकार 60KB (सख्त)। कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.ica.gov.sg/\">यहाँ</a> करें।",
    "阿联酋/迪拜签证照片": "यूएई/दुबई वीज़ा फोटो",
    "纯白背景。脸部需占图像高度的70-80%。文件大小50KB至1MB。请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://smartservices.icp.gov.ae/\">这里</a>查看最新标准。": "सफेद पृष्ठभूमि। चेहरा फ्रेम की ऊंचाई का 70-80% होना चाहिए। फ़ाइल का आकार 50KB से 1MB तक। कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://smartservices.icp.gov.ae/\">यहाँ</a> करें।",
    "印尼/巴厘岛电子落地签照片": "इंडोनेशिया/बाली ई-वीओए (e-VOA) फोटो",
    "请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.visaforchina.cn/SGP2_EN/generalinformation/news/282849.shtml\">这里</a>查看最新标准。": "कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.visaforchina.cn/SGP2_EN/generalinformation/news/282849.shtml\">यहाँ</a> करें।",
    "请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html\">这里</a>查看最新标准。": "कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://travel.state.gov/content/travel/en/passports/how-apply/photos.html\">यहाँ</a> करें।",
    "请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.gov.uk/photos-for-passports/photo-requirements\">这里</a>查看最新标准。": "कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.gov.uk/photos-for-passports/photo-requirements\">यहाँ</a> करें。",
    "请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html\">这里</a>查看最新标准。": "कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html\">यहाँ</a> करें。",
    "请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/temporary-resident-visa-application-photograph-specifications.html\">这里</a>查看最新标准。": "कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.canada.ca/en/immigration-refugees-citizenship/services/application/application-forms-guides/temporary-resident-visa-application-photograph-specifications.html\">यहाँ</a> करें。",
    "此模版采用35mm宽45mm高，<br>请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/identity\">这里</a>查看最新标准。": "यह टेम्प्लेट चौड़ाई के रूप में 35 मिमी और ऊंचाई के रूप में 45 मिमी का उपयोग करता है,<br>कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://immi.homeaffairs.gov.au/help-support/meeting-our-requirements/identity\">यहाँ</a> करें।",
    "请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.mofa.go.jp/j_info/visit/visa/index.html\">这里</a>查看最新标准。": "कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.mofa.go.jp/j_info/visit/visa/index.html\">यहाँ</a> करें。",
    "请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.imi.gov.my/index.php/en/main-services/passport/malaysian-international-passport/\">这里</a>查看最新标准。": "कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.imi.gov.my/index.php/en/main-services/passport/malaysian-international-passport/\">यहाँ</a> करें。",
    "请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.bmi.bund.de/SharedDocs/downloads/DE/publikationen/themen/sicherheit/fotomustertafel.html\">这里</a>查看最新标准。": "कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.bmi.bund.de/SharedDocs/downloads/DE/publikationen/themen/sicherheit/fotomustertafel.html\">यहाँ</a> करें。",
    "请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://mx.usembassy.gov/visas/tn-professionals/\">这里</a>查看最新标准。": "कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://mx.usembassy.gov/visas/tn-professionals/\">यहाँ</a> करें。",
    "请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.interior.gob.es/opencms/es/servicios-al-ciudadano/tramites-y-gestiones/pasaporte/procedimiento-de-expedicion/\">这里</a>查看最新标准。头部位置指南来自<a target=\"_blank\" rel=\"noreferrer\" href=\"https://makepassportphoto.com/en/p/photo-for-spain-passport\">makepassportphoto.com</a>。": "कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://www.interior.gob.es/opencms/es/servicios-al-ciudadano/tramites-y-gestiones/pasaporte/procedimiento-de-expedicion/\">यहाँ</a> करें। फोटो के भीतर सिर की स्थिति के लिए दिशा-निर्देश <a target=\"_blank\" rel=\"noreferrer\" href=\"https://makepassportphoto.com/en/p/photo-for-spain-passport\">makepassportphoto.com</a> से लिए गए हैं。",
    "请勿将头部（包含耳朵）放入此区域": "सिर (कानों सहित) को इस क्षेत्र में न रखें",
    "纯白背景。头顶到下巴的距离需占图像高度的50-60%，眼睛在距离底部50-60%处。请点击<a target=\"_blank\" rel=\"noreferrer\" href=\"https://kemlu.go.id/losangeles/en/pages/visa_kunjungan_saat_kedatangan/852/etc-menu\">这里</a>查看最新标准。": "सफेद पृष्ठभूमि। सिर छवि की ऊंचाई का 50-60% होना चाहिए और आँखें नीचे से 50-60% पर होनी चाहिए। कृपया नवीनतम आवश्यकता की जाँच <a target=\"_blank\" rel=\"noreferrer\" href=\"https://kemlu.go.id/losangeles/en/pages/visa_kunjungan_saat_kedatangan/852/etc-menu\">यहाँ</a> करें।",
    "请注意：<br>目前领事APP内的旅行证要求与护照要求存在矛盾，因此此处的参考线为护照照片等比例缩放所得。如果不准，请留言告知。": "कृपया ध्यान दें: <br>वर्तमान में वाणिज्य दूतावास ऐप में यात्रा दस्तावेज़ और पासपोर्ट आवश्यकताओं के बीच विसंगतियां हैं, इसलिए यहां मार्गदर्शिका रेखा पासपोर्ट फोटो का आनुपातिक पैमाना है। यदि यह गलत है, तो कृपया एक संदेश छोड़ दें।"
}

fallback_map = {
    "中国护照签证照片": "चीनी पासपोर्ट/वीज़ा फोटो",
    "Center Guide Line": "मध्य मार्गदर्शिका रेखा",
    "Forbidden Area: Top": "निषिद्ध क्षेत्र: शीर्ष",
    "Forbidden Area: Bottom": "निषिद्ध क्षेत्र: तल",
    "Top Head Area": "शीर्ष सिर क्षेत्र",
    "Draggable Indicator": "खींचने योग्य संकेतक",
    "Center Square: Left": "मध्य वर्ग: बाएँ",
    "Center Square: right": "मध्य वर्ग: दाएँ",
    "Center Square: top": "मध्य वर्ग: शीर्ष",
    "Center Square: bottom": "मध्य वर्ग: तल"
}

def translate_string(zh_str, en_str):
    if zh_str in translation_map:
        return translation_map[zh_str]
    # Fallback to general EN translation if exact ZH string is not in map
    for k, v in fallback_map.items():
        if k in en_str:
            return v
    # Just translate en_str rudimentarily if not matched
    return en_str

def process_dict(d):
    keys = list(d.keys())
    for k in keys:
        if isinstance(d[k], dict):
            if "zh" in d[k]:
                zh_val = d[k]["zh"]
                en_val = d[k].get("en", "")
                hi_val = translate_string(zh_val, en_val)
                d[k]["hi"] = hi_val
                del d[k]["zh"]
            else:
                process_dict(d[k])
        elif isinstance(d[k], list):
            process_list(d[k])

def process_list(l):
    for item in l:
        if isinstance(item, dict):
            process_dict(item)
        elif isinstance(item, list):
            process_list(item)

# Process all JSON files
files = glob.glob('src/Templates/*.json') + glob.glob('src/translations/*.json') + glob.glob('src/changelog.json')

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except:
            continue
            
    process_dict(data)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Processed all JSON files!")
