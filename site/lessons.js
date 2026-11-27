// ============================================================
// كل محتوى الموقع هنا. لإضافة درس جديد:
// 1) انسخ أي عنصر داخل LESSONS وغيّر n والعنوان والملاحظات والأكواد والتاسك.
// 2) لو الدرس السابق ليه تاسك، ضيف إجابته في ANSWERS[رقم الدرس السابق].
//    الإجابة بتظهر لوحدها تحت الدرس اللي بعده.
// ============================================================
const LESSONS = [
    {
        n: 1,
        title: 'ما هو تطبيق الموبايل؟',
        topic: 'What is a mobile app',
        youtube: 'https://youtu.be/0lc82uuTqn8', dur: 188,
        notes: [
            'التطبيق هو برنامج بيشتغل على الموبايل.',
            'أي تطبيق بيعدي بخطوات: فكرة، تصميم، كود، تجربة، نشر.',
            'الأدوات اللي هنستخدمها في الكورس: VS Code، لغة Dart، وإطار Flutter.',
        ],
        snippets: [],
    },
    {
        n: 2,
        title: 'تجهيز بيئة العمل: VS Code و Dart SDK',
        topic: 'Setup day',
        youtube: 'https://youtu.be/9OoBi_ybQcQ', dur: 264,
        notes: [
            'حمّل VS Code من الموقع الرسمي code.visualstudio.com (النسخة اللي في الدرس: 1.148). فعّل Add to PATH وقت التثبيت.',
            'ثبّت إضافات Dart و Flutter من تبويب Extensions.',
            'حمّل Dart SDK من dart.dev/get-dart (النسخة في الدرس: stable 3.14.2). لو ثبّتّ Flutter، الـ Dart SDK جواه.',
            'اتأكد إن كل حاجة شغالة بأمر dart --version في الـ terminal.',
            'بدائل من غير تحميل: DartPad (dartpad.dev) و vscode.dev، وبيشتغلوا من Chrome.',
        ],
        snippets: [
            { title: 'Terminal: check the version', code: 'dart --version', lang: 'bash' },
            { title: 'Terminal: run a file', code: 'dart run main.dart', lang: 'bash' },
        ],
        task: { text: 'ثبّت VS Code و Dart SDK، واكتب أي أمر print وشغّله بـ dart run main.dart.' },
    },
    {
        n: 3,
        title: 'أول برنامج Dart: void main و variables و print',
        topic: 'First Dart program',
        youtube: 'https://youtu.be/2op43lUThLc', dur: 306,
        notes: [
            'اعمل ملف جديد في VS Code اسمه main.dart.',
            'أي برنامج Dart بيبدأ من void main. من غيره مفيش حاجة بتشتغل.',
            'print بتطبع كلام على الشاشة. وفي آخر كل سطر لازم نقطة وفاصلة.',
            'الـ variable علبة ليها اسم ونوع وقيمة. الأنواع الأساسية: String للنص، int للأرقام الصحيحة، double للكسور، bool لـ true أو false.',
            'var معناها إن Dart يخمّن النوع من القيمة.',
            'علامة $ جوه النص بتحط قيمة المتغير. وقيمة المتغير ممكن تتغير.',
            'أخطاء شائعة: نسيان الفاصلة المنقوطة، قيمة مش على قد النوع، نسيان void main.',
        ],
        snippets: [
            {
                title: 'Hello, Dart',
                code: `void main() {
  print('Hello, Dart!');
}`,
            },
            {
                title: 'Variables and print',
                code: `void main() {
  String name = 'Ahmed';
  int age = 20;
  print('$name is $age years old');
}`,
            },
            { title: 'Types', code: `String name = 'Ahmed';
int age = 20;
double height = 1.75;
bool isStudent = true;
var city = 'Cairo';` },
        ],
        task: { text: 'اعمل تلات متغيرات: اسمك وسنك ومدينتك، واطبعهم في جملة واحدة. شغّل البرنامج وتأكد إن الجملة اتطبعت صح في الـ terminal.' },
    },
    {
        n: 4,
        title: 'الشروط: if و else و switch',
        topic: 'Conditions',
        youtube: 'https://youtu.be/I2phxwrN1MU', dur: 516,
        notes: [
            'الـ control statement كود بيتنفذ بس لو شرط اتحقق.',
            'فكّر بالخطوات قبل الكود: خد القيمة، اتشيك عليها، اطبع النتيجة. بعدين حوّل كل خطوة لسطر.',
            'if فيها تلات أجزاء: الكلمة، الشرط، والبلوك { }. else بتتنفذ لو الشرط غلط.',
            'else if: أول شرط صح هو اللي بيتنفذ والباقي بيتلغي.',
            'فرق مهم: else if ورا بعض غير if ورا بعض. مع if منفصلة كل الشروط بتتشيك، والـ else بتتربط بآخر if بس. النتيجة غلط زي طباعة Excellent وبعدها Invalid.',
            'جرّب كل فرع: لو عندك خمس شروط جرّب خمس مرات، وجرّب أرقام الحدود وأرقام غريبة زي 200.',
            'في else if مش لازم تكرر الحد الأعلى، لأن الشرط اللي قبله اتشيك عليه.',
            'علامات المقارنة: > < >= <= == !=. جوه الشرط استخدم == مش =.',
            '&& يعني الاتنين لازم صح. || يعني واحد صح يكفي.',
            'switch للقيمة الواحدة والحالات الثابتة. استخدم break و default.',
            'القراءة من المستخدم: stdin.readLineSync() بترجع String، وint.parse بتحولها لرقم.',
            'دايماً اكتب الأقواس { } مع if.',
        ],
        snippets: [
            { title: 'if and else', code: `void main() {
  var age = 20;
  if (age >= 18) {
    print('Accepted');
  } else {
    print('Rejected');
  }
}` },
            { title: 'else if (grades)', code: `void main() {
  var score = 85;
  if (score >= 90) {
    print('A');
  } else if (score >= 80) {
    print('B');
  } else {
    print('C');
  }
}` },
            { title: 'Separate ifs (the bug) vs else if chain', code: `void main() {
  var grade = 90;

  // Bug: separate ifs, the last else belongs to the last if only
  if (grade >= 85) print('Excellent');
  if (grade >= 75) print('Very good');
  else print('Invalid');

  // Correct: one chain, first true wins
  if (grade >= 85) {
    print('Excellent');
  } else if (grade >= 75) {
    print('Very good');
  } else {
    print('Invalid');
  }
}` },
            { title: '&& and ||', code: `void main() {
  var age = 20;
  var hasId = true;
  if (age >= 18 && hasId) {
    print('Enter');
  }

  var isAdmin = false;
  var isOwner = true;
  if (isAdmin || isOwner) {
    print('Allowed');
  }
}` },
            { title: 'Nested if', code: `void main() {
  var age = 20;
  var hasTicket = true;
  if (age >= 18) {
    if (hasTicket) {
      print('Welcome');
    } else {
      print('Buy ticket');
    }
  }
}` },
            { title: 'switch', code: `void main() {
  var day = 3;
  switch (day) {
    case 1:
      print('Monday');
      break;
    case 3:
      print('Wednesday');
      break;
    default:
      print('Other day');
  }
}` },
            { title: 'Ternary (one-line if)', code: `void main() {
  var age = 20;
  var msg = age >= 18 ? 'Adult' : 'Minor';
  print(msg);
}` },
            { title: 'Max of 3 numbers', code: `void main() {
  var a = 10, b = 15, c = 20;
  if (a >= b && a >= c) {
    print(a);
  } else if (b >= a && b >= c) {
    print(b);
  } else {
    print(c);
  }
}` },
            { title: 'Read a number from the user', code: `import 'dart:io';

void main() {
  print('Enter a number:');
  int n = int.parse(stdin.readLineSync()!);
  if (n % 2 == 0) {
    print('Even');
  } else {
    print('Odd');
  }
}` },
        ],
        task: { text: 'اكتب برنامج يقول إن الرقم 7 زوجي (Even) ولا فردي (Odd).', hint: 'استخدم n % 2 == 0' },
    },
    {
        n: 5,
        title: 'التكرار: for و while و do-while',
        topic: 'Loops',
        youtube: 'https://youtu.be/IYXUPn76q-M', dur: 521,
        notes: [
            'الـ loop بيكرر كود من غير ما تكتبه بإيدك. بدل مية سطر print بتكتب تلاتة.',
            'قبل أي loop اسأل نفسك تلات أسئلة: أبدأ من كام؟ أقف إمتى؟ وبزيد كام في كل لفة؟',
            'الـ for فيها تلات أجزاء: بداية، شرط، زيادة. البداية بتتنفذ مرة واحدة، وبعدين كل لفة: شرط، تنفيذ، زيادة.',
            'تتبّع الـ loop لفة لفة (i، الشرط، الكود، الزيادة) عشان تلاقي أي غلطة.',
            'i < 5 يدي 5 لفات، و i <= 5 يدي 6 لفات.',
            'متغير الجمع sum بنكتبه قبل الـ loop. أي متغير جوه الـ loop بيتعمل من جديد في كل لفة وبيختفي في آخرها.',
            'while لما مش عارف عدد اللفات. لازم تغيّر قيمة جوه الـ loop وإلا هتبقى infinite loop، وتوقفها بـ Ctrl + C.',
            'do-while بتنفذ الكود مرة على الأقل وبعدين تتشيك على الشرط.',
            'break بتقفل الـ loop كلها، و continue بتتخطى لفة واحدة.',
            'الأرقام الأولية: isPrime بـ true، ولو لقيت رقم بيقسم تخليها false وتكتب break. وخد بالك من 0 و 1: مش أوليين.',
        ],
        snippets: [
            { title: 'Print 1 to 100', code: `void main() {
  for (var i = 1; i <= 100; i++) {
    print(i);
  }
}` },
            { title: 'The 3 parts of for (prints 0 to 4)', code: `void main() {
  for (var i = 0; i < 5; i++) {
    print(i);
  }
}` },
            { title: 'Sum 1 to 10', code: `void main() {
  var sum = 0;
  for (var i = 1; i <= 10; i++) {
    sum = sum + i;
  }
  print(sum);
}` },
            { title: 'Factorial of 5', code: `void main() {
  var fact = 1;
  for (var i = 1; i <= 5; i++) {
    fact = fact * i;
  }
  print(fact);
}` },
            { title: 'Even numbers (two ways)', code: `void main() {
  // 1) step by 2
  for (var i = 2; i <= 100; i += 2) {
    print(i);
  }

  // 2) check with %
  for (var i = 1; i <= 100; i++) {
    if (i % 2 == 0) {
      print(i);
    }
  }
}` },
            { title: 'Prime check with break and a flag', code: `void main() {
  var n = 7;
  var isPrime = true;
  if (n <= 1) {
    isPrime = false;
  } else {
    for (var i = 2; i < n; i++) {
      if (n % i == 0) {
        isPrime = false;
        break;
      }
    }
  }
  print('$n prime? $isPrime');
}` },
            { title: 'while (countdown)', code: `void main() {
  var i = 3;
  while (i > 0) {
    print(i);
    i--;
  }
}` },
            { title: 'do-while', code: `void main() {
  var i = 0;
  do {
    print(i);
    i++;
  } while (i < 3);
}` },
            { title: 'break and continue', code: `void main() {
  for (var i = 1; i <= 10; i++) {
    if (i == 4) break;
    print(i);
  }

  for (var i = 1; i <= 5; i++) {
    if (i == 3) continue;
    print(i);
  }
}` },
            { title: 'Nested loops', code: `void main() {
  for (var r = 1; r <= 3; r++) {
    for (var c = 1; c <= 3; c++) {
      print(r * c);
    }
  }
}` },
        ],
        task: { text: 'اطبع جدول ضرب 5، من 5 × 1 لحد 5 × 10.', hint: 'for من 1 لـ 10 وجواها print(5 * i)' },
    },
];

const ANSWERS = {
    2: { task: 'تسخين: أمر print وتشغيله', code: `void main() {
  print('Hello, Dart!');
}` },
    3: { task: 'تلات متغيرات: الاسم والسن والمدينة', code: `void main() {
  String name = 'Ahmed';
  int age = 20;
  var city = 'Cairo';
  print('$name is $age years old and lives in $city');
}` },
    4: { task: 'الرقم 7 زوجي ولا فردي', code: `void main() {
  var n = 7;
  if (n % 2 == 0) {
    print('Even');
  } else {
    print('Odd');
  }
}` },
};

ANSWERS[5] = { task: 'جدول ضرب 5', code: `void main() {
  for (var i = 1; i <= 10; i++) {
    print(5 * i);
  }
}` };
