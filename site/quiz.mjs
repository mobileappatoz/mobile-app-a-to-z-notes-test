// 5 questions per lesson. q:[ar,en], o:[[ar,en],...], a: index of the correct option (server only, never sent to the page)
const Q=(q,o,a)=>({q,o,a});
const same=s=>[s,s];
export const QUIZ={
1:[
 Q(['إيه ترتيب خطوات أي تطبيق؟','What is the order of steps for any app?'],[['كود، فكرة، نشر، تصميم، تجربة','Code, idea, publish, design, test'],['فكرة، تصميم، كود، تجربة، نشر','Idea, design, code, test, publish'],['نشر، كود، تجربة، فكرة، تصميم','Publish, code, test, idea, design']],1),
 Q(['إيه هو تطبيق الموبايل؟','What is a mobile app?'],[['برنامج بيشتغل على الموبايل','A program that runs on a phone'],['موقع بيتفتح من الكمبيوتر بس','A website that only opens on a computer'],['شاشة الموبايل نفسها','The phone screen itself']],0),
 Q(['اللغة اللي هنستخدمها في الكورس؟','Which language do we use in the course?'],[same('Java'),same('Python'),same('Dart')],2),
 Q(['Flutter هو؟','What is Flutter?'],[['إطار بيستخدم Dart عشان يبني شاشات التطبيق','A framework that uses Dart to build the app screens'],['نظام تشغيل للموبايل','A phone operating system'],['لغة برمجة مستقلة عن Dart','A programming language separate from Dart']],0),
 Q(['إيه المحرر اللي هنكتب فيه الكود؟','Which editor do we write code in?'],[same('VS Code'),same('Photoshop'),same('Excel')],0)],
2:[
 Q(['أمر بنتأكد بيه إن Dart اتثبت؟','Which command checks that Dart is installed?'],[same('dart --version'),same('dart install'),same('dart check')],0),
 Q(['لو ثبّتّ Flutter، الـ Dart SDK؟','If you install Flutter, the Dart SDK is?'],[['لازم أحمّله لوحده','You must download it separately'],['جوه Flutter','Included inside Flutter'],['مش محتاجه خالص','Not needed at all']],1),
 Q(['بديل من غير تحميل لتجربة Dart؟','A no-download way to try Dart?'],[same('DartPad'),same('Photoshop'),same('Word')],0),
 Q(['إزاي بتشغّل ملف main.dart؟','How do you run main.dart?'],[same('dart open main.dart'),same('run dart main'),same('dart run main.dart')],2),
 Q(['إيه الإضافات اللي بنثبتها في VS Code؟','Which extensions do we install in VS Code?'],[['Python و Java','Python and Java'],['Dart و Flutter','Dart and Flutter'],['Git و Docker','Git and Docker']],1)],
3:[
 Q(['أي برنامج Dart بيبدأ من؟','Every Dart program starts from?'],[same('void main'),same('start()'),same('print')],0),
 Q(['إيه الأمر اللي بيطبع كلام على الشاشة؟','Which command prints text on the screen?'],[same('show'),same('print'),same('write')],1),
 Q(['إيه النوع المناسب للكسور زي 3.14؟','Which type fits fractions like 3.14?'],[same('int'),same('bool'),same('double')],2),
 Q(['إزاي بتحط قيمة متغير اسمه name جوه نص؟','How do you put a variable called name inside a string?'],[same('$name'),same('#name'),same('&name')],0),
 Q(['إيه اللي بينهي الجملة في Dart؟','What ends a statement in Dart?'],[['نقطة .','A dot .'],['فاصلة ,','A comma ,'],['نقطة وفاصلة ;','A semicolon ;']],2)],
4:[
 Q(['في سلسلة else if، لما أول شرط صح؟','In an else if chain, when the first condition is true?'],[['كل الشروط بتتنفذ','All conditions run'],['الباقي بيتلغي','The rest are skipped'],['البرنامج بيقف بخطأ','The program stops with an error']],1),
 Q(['إيه علامة مقارنة التساوي؟','Which operator compares equality?'],[same('='),same('=='),same('=>')],1),
 Q(['إيه العلامة اللي معناها "الشرطين صح مع بعض"؟','Which operator means "both conditions are true"?'],[same('&&'),same('||'),same('!')],0),
 Q(['إيه العلامة اللي يكفي إن واحد من الشرطين يبقى صح؟','Which operator needs only one condition to be true?'],[same('&&'),same('=='),same('||')],2),
 Q(['إيه شكل الـ if المختصرة (ternary)؟','What does the one-line if (ternary) look like?'],[same('condition ? a : b'),same('if condition then a else b'),same('condition => a | b')],0)],
5:[
 Q(['إيه أجزاء الـ for التلاتة؟','What are the 3 parts of for?'],[['بداية، شرط، زيادة','Start, condition, increment'],['اسم، نوع، قيمة','Name, type, value'],['if، else، switch','if, else, switch']],0),
 Q(['for (var i = 0; i < 5; i++) بتلف كام لفة؟','How many rounds does for (var i = 0; i < 5; i++) run?'],[same('4'),same('5'),same('6')],1),
 Q(['الـ do-while بتنفذ الكود؟','The do-while runs the code?'],[['مرة واحدة على الأقل','At least once'],['ولا مرة لو الشرط غلط','Never if the condition is false'],['مرتين بالظبط','Exactly twice']],0),
 Q(['إيه الكلمة اللي بتخرج من الـ loop كله؟','Which keyword leaves the whole loop?'],[same('continue'),same('stop'),same('break')],2),
 Q(['متغير الجمع sum بنكتبه فين؟','Where do we declare the sum variable?'],[['قبل الـ loop','Before the loop'],['جوه الـ loop','Inside the loop'],['بعد الـ loop','After the loop']],0)]
};
