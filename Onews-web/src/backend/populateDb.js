var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return
}

var async = require('async');
var User = require('./models/user');
var Article = require('./models/article');
var Category = require('./models/category');
var Comment = require('./models/comment');
var HotTopic = require('./models/hotTopic');


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];
var articles = [];
var categories = [];
var subCategories = [];
var comments = [];
var hotTopics = [];

function userCreate(username, full_name, email, d_birth, cb) {
  userdetail = { username: username, full_name: full_name, email: email }
  if (d_birth != false) userdetail.date_of_birth = d_birth;

  var user = new User(userdetail);

  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    // console.log('New user: ' + user);
    users.push(user)
    cb(null, user)
  });
}

function articleCreate(img, title, content, category_id, hot_topic_id, author, created_time, cb) {
  var article = new Article({
    img: img,
    title: title,
    content: content,
    category_id: category_id,
    hot_topic_id: hot_topic_id,
    author: author,
    created_time: created_time
  });

  article.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    // console.log('New article: ' + article);
    articles.push(article)
    cb(null, article);
  });
}

function hotTopicCreate(name, created_time, cb) {
  var hotTopic = new HotTopic({
    name: name,
    created_time: created_time
  });

  hotTopic.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    // console.log('New category: ' + category);
    hotTopics.push(hotTopic)
    cb(null, hotTopic)
  });
}

function categoryCreate(name, level, parent_id, cb) {
  var category = new Category({
    name: name,
    level: level,
    parent_id: parent_id
  });

  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    // console.log('New category: ' + category);
    categories.push(category)
    cb(null, category)
  });
}

function subCategoryCreate(name, level, parent_id, cb) {
  var category = new Category({
    name: name,
    level: level,
    parent_id: parent_id
  });

  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    subCategories.push(category)
    cb(null, category)
  });
}

function createCategories(cb) {
  async.parallel([
    function (callback) {
      categoryCreate('Star', 1, null, callback); //0
    },
    function (callback) {
      categoryCreate('Ciné', 1, null, callback); //1
    },
    function (callback) {
      categoryCreate('Musik', 1, null, callback); //2
    },
    function (callback) {
      categoryCreate('Xã Hội', 1, null, callback); //3
    },
    function (callback) {
      categoryCreate('Thế Giới', 1, null, callback); //4
    },
    function (callback) {
      categoryCreate('Sport', 1, null, callback); //5
    }
  ],
    cb);
}

function createSubCategories(cb) {
  async.parallel([
    function (callback) {
      subCategoryCreate('Sao Việt', 2, findItemByName(categories, 'Star'), callback); //6
    },
    function (callback) {
      subCategoryCreate('Sao Hàn', 2, findItemByName(categories, 'Star'), callback); //6
    },
    function (callback) {
      subCategoryCreate('Phim Việt Nam', 2, findItemByName(categories, 'Ciné'), callback); //7
    },
    function (callback) {
      subCategoryCreate('Phim Âu Mỹ', 2, findItemByName(categories, 'Ciné'), callback); //8
    },
    function (callback) {
      subCategoryCreate('Nhạc Việt Nam', 2, findItemByName(categories, 'Musik'), callback); //9
    },
    function (callback) {
      subCategoryCreate('Đá Bóng', 2, findItemByName(categories, 'Sport'), callback); //10
    },
    function (callback) {
      subCategoryCreate('Nhạc Âu-Mỹ', 2, findItemByName(categories, 'Musik'), callback); //11
    }
  ],
    cb);
}

function createHotTopics(cb) {
  async.parallel([
    function (callback) {
      hotTopicCreate('Vợ Giết Chồng Rồi Phân Xác Phi Tang', '2017-12-17T18:01:00Z', callback);
    },
    function (callback) {
      hotTopicCreate('Jonghyun (SHINee) Tự Tử', '2017-12-19T08:01:00Z', callback);
    },
    function (callback) {
      hotTopicCreate('Noel 2017', '2017-12-14T08:01:00Z', callback);
    }
  ],
    cb);
}

function createArticles(cb) {
  async.parallel([
    function (callback) {
      articleCreate(
        'images/articles/20150904_163858.jpg',
        'Dân mạng tranh luận khi Hồ Quang Hiếu tiết lộ lý do chia tay, Bảo Anh lên tiếng đấy bất ngờ!',
        ['Sau gần 3 năm hẹn hò, Hồ Quang Hiếu và Bảo Anh công khai chuyện đường ai nấy đi trong sự tiếc nuối của công chúng. Sau khi chia tay, cặp đôi vẫn giữ mối quan hệ rất tốt đẹp khi thường xuyên bình luận và trò chuyện trên mạng xã hội.', ' Tuy nhiên mới đây, Hồ Quang Hiếu bất ngờ gây xôn xao khi tiết lộ lý do chính dẫn đến việc cả hai bất đồng quan điểm sống. Cụ thể, anh cho biết từng ngỏ lời cầu hôn giọng ca "Anh muốn em sống sao" nhưng đã bị cô từ chối.', 'Thông tin này nhanh chóng được cư dân mạng lan truyền chóng mặt. Trên một diễn đàn nổi tiếng, đông đảo người hâm mộ bàn tán về nguyên nhân khiến Bảo Anh từ chối Hồ Quang Hiếu. Trong lúc cuộc tranh luận diễn ra vô cùng sôi nổi, chính Bảo Anh đã để lại bình luận giải đáp thắc mắc của công chúng khiến ai nấy không khỏi bất ngờ. Nữ ca sĩ viết: "Lên xuống là chuyện thường ở đời. Chứ còn lấy chồng thì cứ phải tử tế thì lấy không thì thôi ở vậy với mẹ. Đời còn dài cứ từ từ không có gì phải vội".'],
        findItemByName(subCategories, 'Sao Việt'),
        null,
        'SA, THEO TRÍ THỨC TRẺ ',
        '2017-12-16T18:01:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/2-1513326722925.jpg',
        'Quý Bình kể chuyện nuôi con đơn thân trong phim do biên kịch "Tôi thấy hoa vàng trên cỏ xanh" chắp bút',
        ['"Ở đây có nắng" là sản phẩm điện ảnh đánh dấu sự trở lại của biên kịch Việt Linh sau thành công của "Tôi thấy hoa vàng trên cỏ xanh". Sự kết hợp của chị và đạo diễn Đỗ Nam trong phim điện ảnh mới về tình phụ tử hứa hẹn sẽ lấy nước mắt khán giả.','Dự án phim điện ảnh Ở đây có nắng vừa bất ngờ tung trailer và poster ấm áp về tình cảm gia đình để chuẩn bị ra rạp dịp đầu năm 2018.', 'Phim do đạo diễn trẻ Đỗ Nam thực hiện, đạo diễn Việt Linh đảm nhận phần biên kịch. Dàn diễn viên trong phim gồm có: Quý Bình, Quỳnh Chi, Trương Thanh Long, Huy Khánh, Lê Chi Na, Miko Lan Trinh, Gia Bảo, Ngân Chi, Anh Thơ, Lê Bình, Hạnh Thuý…', 'Bộ phim xoay quanh nhân vật Tùng Nhân (diễn viên Quý Bình) – một MC, đạo diễn chương trình truyền hình nổi tiếng đang sống yên vui với người yêu là Phương Thuỳ (diễn viên Quỳnh Chi) tại một căn biệt thự. Bỗng một ngày, Tùng Nhân bàng hoàng phát hiện mình có cậu con trai tên Bin (diễn viên nhí Gia Bảo) “trên trời rơi xuống” - kết quả mối tình nhiều năm trước với Mai Chi (diễn viên Anh Thơ) - người yêu cũ.', 'Thừa nhận đứa trẻ đồng nghĩa với việc sẽ vướng vào tai tiếng, sự nghiệp có thể tiêu tan, nhưng nhìn thấy con sống bơ vơ, nhớ lại thân cảnh mồ côi của chính mình thì Tùng Nhân không đành lòng. Giữa sự giằng co về việc nhận hay không nhận con mà Phương Thuỳ và quản lý của Tùng Nhân là Long (diễn viên Trương Thanh Long) trở thành như kẻ thù, thì Tùng Nhân quyết định sẽ nhận Bin về nuôi bất chấp tất cả. Tuy nhiên, tình phụ tử vừa ấm áp thì những biến cố bất ngờ lại xảy đến khiến cuộc đời các nhân vật lại rơi vào một vòng xoáy không có hồi kết…', 'Được biết, đây là sản phẩm điện ảnh đánh dấu sự trở lại của đạo diễn Việt Linh trên vai trò biên kịch sau thành công vang dội của “Tôi thấy hoa vàng trên cỏ xanh”. Với lối viết sắc sảo, chân thực cùng bề dày kinh nghiệm, Việt Linh muốn truyền tải thông điệp: “Gia đình không chỉ là mối tương quan huyết thống, mà còn là sự yêu thương gắn bó giữa những tâm hồn”.', 'Lý giải cho thông điệp này, đạo diễn Việt Linh cho rằng: “Xã hội hiện đại khiến con người phải sớm xa thân nhân, bắt đầu những quan hệ khăng khít với người xa lạ. Hiện tượng này tạo nên định nghĩa gia đình mới, ở đó gia đình không chỉ là mối tương quan cốt nhục, mà còn là sự thương yêu, gắn bó giữa những tâm hồn với nhau để tạo nên một gia đình”.', 'Phim dự kiến sẽ ra rạp vào ngày 12/1/2018 tới đây.'],
        findItemByName(subCategories, 'Phim Việt Nam'),
        null,
        'MAI MON, THEO TRÍ THỨC TRẺ ',
        '2017-12-15T17:42:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/anh1-1513356515129.jpg',
        'Lưu ngay danh sách tất tần tật những "siêu phẩm" sắp ra mắt của Vũ trụ Điện ảnh DC',
        ['Số phận của Vũ trụ Điện ảnh DC hiện đang là một trong số những chủ đề "nóng" nhất được thảo luận, với khá nhiều mối lo ngại sau thất bại phòng vé và phản hồi tiêu cực từ giới chuyên môn của Justice League.', ' Ngoại trừ Wonder Woman, chưa có phim nào trong Vũ trụ này nhận được đánh giá tốt của các nhà phê bình, khiến cho Warner Bros. phải liên tục thay đổi kế hoạch của họ khá nhiều lần. Tuy nhiên, hãng DC vẫn sẽ tiếp tục tiến về phía trước với các dự án vốn đã được khởi động của họ trong một công bố cuối tuần vừa qua tại Comic Con Experience 2017 tại Sao Paolo, Brazil.', '1. Aquaman (21/12/2018)', 'Aquaman là bộ phim tiếp theo của Vũ trụ Điện ảnh DC sẽ được Warner Bros. ra mắt, và là bộ phim thứ 6 của họ. Jason Momoa sẽ tiếp tục vao vai người anh hùng cá tính đến từ đại dương, đối đầu với hai đối thủ đáng gờm là Black Manta và Ocean Master. Các diễn viên khác được kỳ vọng sẽ cùng tham gia bộ phim là Amber Heard, Nicole Kidman, Willem Dafoe, Dolph Lundgren, Patrick Wilson, Yahya Abdul-Matten II và Ludi Lin.', '2. Shazam! (05/04/2019)', 'Đạo diễn David F. Sandberg là người hiện đang chịu trách nhiệm cho bộ phim Shazam!, với diễn viên Zachary Levi và Asher Angel, dự kiến khởi quay vào tháng 2 tới. Mark Strong đã được lựa chọn để vào vai phản diện Doctor Sivana. Hiện chưa có thông tin gì về kịch bản phim, ngoài việc nhân vật Black Adam do Dwayne Johnson thủ vai sẽ không xuất hiện như kế hoạch ban đầu.', '3. Wonder Woman 2 (01/11/2019)', 'Sau thành công rực rỡ của phần đầu tiên mùa hè vừa qua, Warner Bros. đã đẩy nhanh tiến độ cho phần tiếp theo của Wonder Woman, dự kiến khởi chiếu vào 01/11/2019. Gal Gadot đương nhiên sẽ tiếp tục tái hiện hình ảnh nữ chiến binh Amazon mạnh mẽ này, với bối cảnh xảy ra vào thời kỳ Chiến tranh Lạnh. Thông tin về nội dung bộ phim vẫn còn hạn chế, ngoại trừ việc Chris Pine được cho là sẽ trở lại trong vai Steve Trevor, bất chấp việc nhân vật này (dường như) đã hi sinh trong phần đầu. Có thể nói, Wonder Woman hiện đang một mình gánh vác toàn bộ Vũ trụ DC trên vai.', '4. The Batman', 'Đây là một bộ phim đã trải qua hàng loạt những biến động khó lường từ khi được công bố. Ban đầu, Ben Affleck được lựa chọn để viết kịch bản, đạo diễn, và nhập vai Batman luôn, nhưng hiện giờ Matt Reeves (War for the Planet of the Apes) đã nắm giữ trọng trách làm phim này trong tay. Không chỉ vậy, người ta còn lo lắng rằng Ben Affleck sẽ không khoác lên mình tấm áo choàng dơi thêm một lần nào nữa. Trong khi đó, đã có những tin đồn về việc hãng Warner Bros. đang cân nhắc những cái tên khác thay thế cho Affleck như Jake Gyllenhaal hay Jon Hamm.', '5. Suicide Squad 2', 'Suicide Squad 2 là mộ trong số những dự án gây bất ngờ nhất của DC khi phần phim đầu tiên về nhóm siêu tội phạm này không thực sự được yêu thích bởi… bất cứ ai. Tuy nhiên, bộ phim vẫn mang về đủ lợi nhuận để DC đặt niềm tin vào một dự án nối tiếp cho các nhân vật này. Có tin đồn cho rằng, thay vì xuất hiện trong Shazam! với vai trò phản diện chính, Black Adam sẽ xuất hiện trong phần 2 của phim này, đối đầu với đội quân của Amanda Waller. Ngày bấm máy đã được xác định khởi đầu vào tháng 3 năm tới, cùng sự tham gia của đạo diễn Gavin O’connor.'],
        findItemByName(subCategories, 'Phim Âu Mỹ'),
        null,
        'SPLENDID RIVER, THEO TRÍ THỨC TRẺ ',
        '2017-12-15T17:01:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/photo1513359321718-1513359321720.png',
        'Dân mạng "hóng" vì xem teaser MV mới của Ngô Kiến Huy mà cứ tưởng “Lạc Trôi” phần 2',
        ['Từ tạo hình nhân vật đậm màu sắc cổ trang cho tới những cách quay dồn dập tạo cảm giác tò mò trong teaser MV mới của Ngô Kiến Huy khiến khán giả ngỡ như đang xem phần 2 "Lạc trôi" (Sơn Tùng M-TP).', 'Mới đây, Ngô Kiến Huy vừa cho ra mắt teaser MV đầy ma mị mang tên "Lạc giữa nhân gian". Xuyên suốt đoạn teaser dài 39 giây, MV của "chàng Bắp" gây ấn tượng đặc biệt bởi những hình ảnh đan xen giữa quá khứ và hiện tại, giữa thực và ảo, mang hơi hướng cổ trang với concept ma mị, tạo hình tóc trắng, trang phục đậm màu sắc kiếm hiệp.', 'Tuy nhiên, cũng từ những chi tiết này, người hâm mộ nhanh chóng phát hiện sự trùng hợp thú vị giữa teaser "Lạc giữa nhân gian" và MV "Lạc trôi" của Sơn Tùng M-TP. Không chỉ cùng được áp dụng cách quay, cách dựng dồn dập tạo cảm giác tò mò, "Lạc trôi" và "Lạc giữa nhân gian" còn "gặp gỡ" ở tạo hình đậm màu sắc cổ trang của Sơn Tùng và Ngô Kiến Huy.', 'Được biết đạo diễn MV "Lạc giữa nhân gian" chính là Đinh Hà Uyên Thư - người từng ghi dấu ấn khi thực hiện thành công 2 MV cổ trang nổi đình nổi đám là "Lạc Trôi" (Sơn Tùng) và "Sống Xa Anh Chẳng Dễ Dàng" (Bảo Anh). Và điều này vô tình tạo áp lực lớn lên sản phẩm âm nhạc của Ngô Kiến Huy khi người hâm mộ đang chờ đợi vị đạo diễn này sẽ giải bài toán cổ trang của anh làm sao để vừa gây ấn tượng mà vẫn có sự khác biệt so với 2 MV đã ra mắt trước đó, nhất là "Lạc trôi" của Sơn Tùng M-TP.', 'Dẫu sao "Lạc giữa nhân gian" cũng chỉ mới được hé lộ dưới hình thức teaser ngắn, muốn xem hoàn chỉnh để đánh giá có phải sản phẩm âm nhạc "anh em" của "Lạc Trôi" hay không thì người hâm mộ vẫn phải chờ tới ngày 18/12 tới đây khi Ngô Kiến Huy phát hành chính thức.'],
        findItemByName(subCategories, 'Nhạc Việt Nam'),
        null,
        'XOÀI, THEO TRÍ THỨC TRẺ  ',
        '2017-12-17T03:57:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/mg2782-1513417513562.jpg',
        'LIME tự tin thể hiện các ca khúc bằng tiếng Hàn Quốc, thẳng thắn phủ nhận tin đồn nhóm sắp tan rã',
        ['Bên cạnh những giây phút vui nhộn, thoải mái đúng với tinh thần một girlgroup hiện đại, các cô gái nhóm LIME cũng dành những khoảng lặng để chia sẻ về chặng đường đã đi qua trong âm nhạc và thẳng thắn tin đồn nhóm sắp tan rã.', 'Ngày 16/12, đúng với tinh thần của một girl group hiện đại, 3 cô nàng của nhóm LIME đến với Saturday Radio trong tâm thế vui - chơi và chiều fan hết mình. Đậm nét xì-tin đúng chất của chủ đề chương trình, các cô gái đã thể hiện những ca khúc rộn rã của mình qua phong cách acoustic, đồng thời khoe được khả năng hát live tốt.', 'Mở đầu chương trình, LIME đã đem đến ca khúc "Party Girlz" - bài hát được ra mắt trong buổi fan-meeting đầu tiên của nhóm. Tiếp đến là những bài hát có tiết tấu sôi động, vui nhộn như "Đừng vội", "The Show" hay tự tin thể hiện ca khúc bằng tiếng Hàn Quốc như "Lonely" hay "Baby Boo".', 'Chia sẻ về khoảng thời gian khó khăn nhất trong quá trình hoạt động âm nhạc, Emma cho biết đó là lúc thành viên thứ 4 rời đi sau nửa năm thành lập khiến tất cả lịch trình của cả nhóm bị ngưng lại, không biết tương lai sau đó sẽ phải làm gì.', '"Thời điểm đó, mỗi sáng thức dậy, tâm trạng cả nhóm nặng nề, nhìn mặt nhau mà không ai nở một nụ cười, cũng không biết phải làm gì, cảm thấy tương lai mịt mù. Mà tuổi trẻ trôi đi, điều đáng sợ nhất là khi mình sống không có mục đích, thậm chí còn mất phương hướng. Mỗi ngày đều sinh hoạt, lên phòng tập luyện bình thường nhưng không có bất cứ một lịch trình nào cụ thể, không có ai dẫn dắt, định hướng đường đi" - LIME xúc động chia sẻ.', 'Bên cạnh những giây phút nhí nhảnh, vui đùa thì các thành viên của LIME đã cùng nhau ngồi lại, nói ra những điều luôn giữ trong lòng. Em út của LIME - Emma cũng bật khóc chia sẻ mặc dù bản tính nóng nảy, cách nói dễ hiểu lầm nhưng trong lòng cô luôn hiểu được tâm tư các thành viên trong nhóm. Ngay sau đó, Liz và Ivone cũng cho biết chính vì sự hồn nhiên, vô tư của Emma như vậy đôi khi bị fan hiểm nhầm, thậm chí gặp phải những bình luận ác ý gây tổn thương. Hai người cũng đã dành những lời khuyên cho cô em gái này rất nhiều.', 'Trong chương trình, cả 3 cô gái đã đồng loạt lên tiếng phủ nhận tin đồn nhóm sắp tan rã và các thành viên có ý định tách ra solo trong thời gian vừa qua. "Lời đồn đó là sai. Thực ra mọi người nên nghĩ rộng ra rằng nếu nằm trong một nhóm nhạc chưa có vị trí nhất định mà thành viên tách ra solo thì cũng không thể có thành công được" - trưởng nhóm Liz khẳng định.'],
        findItemByName(subCategories, 'Nhạc Việt Nam'),
        null,
        'MAI MON, THEO TRÍ THỨC TRẺ ',
        '2017-12-14T07:57:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/photo1513400093810-1513400093810.jpg',
        'Shawn Mendes xuýt xoa khen BTS đẹp và biểu diễn "như phim"',
        ['Những chia sẻ của ngôi sao Canada trong cuộc phỏng vấn mới đây đang khiến các fan BTS rất mát lòng mát dạ.', 'Sau cơ hội gặp gỡ tại lễ trao giải American Music Awards giữa tháng 11, chủ nhân hit "There is Nothing Holding Me Back" vừa có những chia sẻ khiến fan BTS "sướng nổ mũi" trong cuộc phỏng vấn mới đây.', 'Shawn Mendes và BTS đã có cơ hội gặp gỡ tại AMAs diễn ra vào 19/11 vừa qua', 'Bật mí về việc được gặp BTS trong hậu trường AMAs, Shawn Mendes xuýt xoa về vẻ đẹp của các chàng trai đến từ xứ kim chi: "Họ thực sự rất ngọt ngào. Chắc họ là những chàng trai đẹp nhất mà tôi từng gặp trong đời. Thực sự đấy, tôi không thể nghĩ là có người đẹp đến như vậy".', 'Ngôi sao Canada không quên chia sẻ suy nghĩ trước màn trình diễn của BTS tại AMAs: "Sân khấu của họ đúng là không tưởng. Tôi đã xem lại video của họ thậm chí cả mấy trăm lần luôn. Tôi có cảm giác nó giống một bộ phim mà phải quay đi quay lại cả ngàn lần để đạt đến sự hoàn hảo, nhưng họ lại thực hiện thành công chỉ trong một lần trên sóng truyền hình trực tiếp, thực sự quá tuyệt vời."', 'Khi được hỏi về mong muốn hợp tác với BTS nếu có cơ hội, Shawn không do dự đồng ý: "Tất nhiên rồi, tôi rất hân hạnh nếu có thể, và tôi nghĩ nó sẽ rất tuyệt".'],
        findItemByName(subCategories, 'Nhạc Âu-Mỹ'),
        null,
        'DAASOOM, THEO TRÍ THỨC TRẺ ',
        '2017-12-18T08:06:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/img8699-1513435221415.jpg',
        'Nam công nhân phát hiện đầu người trong thùng rác: "Tôi như người mất hồn khi mở túi nylon ra”',
        ['Nam công nhân tâm sự vẫn chưa thể hết ám ảnh khi phát hiện đầu người trong túi nylong ở thùng rác.', 'Đến chiều tối ngày 16/12, người dân vẫn chưa hết xôn xao sau vụ việc phát hiện 1 đầu người cùng nội tạng được giấu trong bịch đen, bỏ trong ba lô tại đường Thuận Giao 09 (phường Thuận Giao, thị xã Thuận An, Bình Dương). Theo người dân, thông qua thi thể thì thấy nạn nhân không phải là người địa phường. Hơn nữa, trước đó tại khu vực này không có sự việc đánh nhau nào nghiêm trọng.', 'Qua tìm hiểu, khu vực này thường xuyên có người qua lại vì nhiều công nhân thuê trọ. Tuy nhiên, sau vụ việc kinh hoàng vừa rồi nhiều người cảm thấy e dè khi đi qua hiện trường.', 'Như chúng tôi đã thông tin, trước đó vào chiều ngày 16/12, anh Nguyễn Văn Tiến (32 tuổi, quê An Giang) làm nghề thu gom rác phát hiện 1 đầu người cùng nội tạng lúc đang làm việc.', 'Mặc dù chỉ tình cờ phát hiện một phần thi thể người lúc đang đi thu gom rác nhưng đến hiện tại anh Tiến vẫn chưa hết ám ảnh.', 'Anh kể, mọi ngày anh thường cùng 3 người nữa đi lấy rác tại khu vực KDC Thuận Giao. Sau đó đến khu vực khách sạn H.S để tiếp tục gom rác. Trưa ngày 16/12, anh đến đường Thuận Giao 09 để nhân viên khách sạn H.S đổ các thùng rác vào lên xe.', 'Sau đó anh phân loại rác thì thấy một chiếc balo màu đen còn mới, khi xác lên thử thì cảm giác khá nặng. "Tôi tò mò mở ra thử thì phát hiện một bọc nylon màu đen. Tiếp tục xé bao nylon này thì hoảng hồn phát hiện một chiếc đầu người còn dính đầy máu. Ám ảnh hơn là khi bên trong bịch nylon này là một bọc nhỏ khác đựng lá phổi người", anh Tiến chưa hết ám ảnh khi nhắc lại.', 'Theo anh Tiến, sau đó anh nhanh chóng la lên, tri hô và nhờ người dân gọi điện báo công an. Còn phần anh và một số người dân còn lại, cố giữ bình tĩnh để bảo vệ hiện trường, chờ cơ quan chức năng tới.', '"Từ lúc mở cái balo ra và phát hiện đầu người cùng lá phổi, tôi như người mất hồn. Đến giờ này tôi vẫn còn hoảng loạn và ám ảnh sau vụ việc. Có thể tối nay phải uống chút rượu cho say để dễ ngủ”, anh Tiến chia sẻ..', 'Hiện vụ việc đang các trinh sát Công an tỉnh Bình Dương phối hợp cùng Công an TX Thuận An, Công an phường Thuận Giao đã đi rà soát hơn hang nghìn phòng trọ trên địa bàn phường để điều tra vụ việc.'],
        findItemByName(categories, 'Xã Hội'),
        findItemByName(hotTopics, 'Vợ Giết Chồng Rồi Phân Xác Phi Tang'),
        'TỨ QUÝ, THEO TRÍ THỨC TRẺ',
        '2017-12-16T09:01:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/photo-1-1513405714538.jpg',
        'Toàn là đàn ông, tại sao Thành Cát Tư Hãn lại phát cho mỗi binh sĩ 1 bộ đồ lót bằng lụa?',
        ['Nổi tiếng là một nhà lãnh đạo, quân sự kiệt xuất trong lịch sử thế giới, cuộc đời chinh chiến của Thành Cát Tư Hãn được bao phủ bởi không ít giai thoại ly kỳ, bí ẩn. Tương truyền rằng, vó ngựa Mông Cổ dưới thời Thành Cát Tư Hãn đã từng tạo nên nỗi kinh trên khắp đại lục Á – Âu. Vậy đâu là chìa khóa giúp vị Đại hãn này huấn luyện nên đội quân phi phàm như vậy?', 'Trong một công trình nghiên cứu mang tên "Gió bão phương Đông: Từ Thành Cát Tư Hãn đến Hốt Tất Liệt, chia rẽ đại lục Á - Âu", tác giả đã giới thiệu cặn kẽ những đặc thù về tổ chức cũng như trang bị trong đội quân Mông Cổ hồi thế kỷ thứ 13.', 'Theo đó, dưới thời kỳ trị vì của Thành Cát Tư Hãn, quân đội nắm quyền khống chế đại bộ phận đời sống và tính mạng của người dân. Cụ thể, nam tử từ 14 tuổi trở lên đều phải xung quân, chỉ có thầy thuốc, quan phủ và tăng lữ được miễn chế độ.', 'Sau khi nhận được lệnh chiêu mộ nhập ngũ, những binh lính trẻ sẽ rời gia tộc, chuẩn bị sẵn từ 4-5 con ngựa tốt. Thê thiếp và con cái cũng có thể đi theo tòng quân. Nhưng sau khi xuất ngũ, toàn bộ tài sản, gia quyến đều phải rời khỏi doanh trại.', 'Lều chứa thuốc men, quân trang, khí giới được bố trí biệt lập với khu vực đóng quân. Những binh lính mới gia nhập khi tới doanh trại có thể lập tức tới đây nhận trang bị, sau đó chính thức gia nhập quân ngũ.', 'Thành Cát Tư Hãn tổ chức quân đội Mông Cổ thành các nhóm theo cơ số 10, gồm có: "Yêm ban" – 10 người một đội; "Châm hồn" – 10 yêm ban, tức 100 người 1 đội; "Minh An" – 10 châm hồn, tức 1000 người 1 đội; "Thổ An" – 10 minh an, tức 10.000 người 1 đội.', 'Các đơn vị này đều do tướng lĩnh phụ trách hậu cần quản lý, cung cấp và điều động.', 'Có gì trong mỗi chiếc túi trên lưng ngựa của binh lính Mông Cổ?', 'Mỗi binh lính đều phải tự chịu trách nhiệm về quân trang của mình và trải qua những cuộc kiểm tra định kỳ. Nếu trang bị cá nhân không đầy đủ, họ sẽ bị đuổi ra khỏi quân ngũ và trục xuất về nhà.', 'Các binh lính đều được cấp cho một bộ đồ lót làm bằng tơ lụa. Đây cũng là giai thoại nổi tiếng về đội quân huyền thoại này.', 'Người Mông Cổ tin rằng mũi tên dù sắc bén tới nỗi xuyên thủng giáp, nhưng lại không thể xuyên qua tơ lụa. Trong trường hợp người lính trúng tên, tơ lụa sẽ theo đầu mũi tên găm vào vết thương.', 'Thông thường, việc rút mũi tên ra khỏi cơ thể sẽ làm vết thương bị rách ra và càng trở nên nghiêm trọng. Nhưng khi có đồ lót tơ lụa, lớp tơ lụa này sẽ quấn vào đầu mũi tên, giúp việc rút tên diễn ra dễ dàng và ít đau đớn hơn.', 'Binh lính có thể tự mình rút tên bằng cách lay nhẹ tơ lụa xung quanh vết thương hoặc có thể nhờ đến sự chữa trị của thầy thuốc mà không lo vết thương bị xé rách.', 'Cùng với đồ lót tơ lụa, mỗi binh lính càng được trang bị một chiếc áo thắt eo. Đối với kỵ binh nặng, họ còn có thêm áo giáp cùng một tấm giáp quấn quanh ngực.', 'Các kỵ binh nặng còn được trang bị khiên gỗ, cùng với đó còn có mũ giáp làm từ da hoặc sắt tùy theo cấp bậc. Về vũ khí, mỗi binh sĩ một bộ cung tiễn với túi mũi tên không dưới 60 tên.', 'Kỵ binh nhẹ được trang bị một thanh kiếm ngắm cùng 2-3 mũi giáo. Trong khi đó kỵ binh nặng sử dụng kiếm dài lưỡi cong, chùy, rìu chiến và một trường mâu dài tới 4 mét.', 'Quân trang của binh lính còn có cung cấp đủ lương thực, dụng cụ phục vụ cho những chuyến hành quân xa như đồ cho ngựa chiến, dụng cụ nấu ăn, thịt khô, nước, đồ dũa mài mũi tên, kim may quần áo… và nhiều thứ khác dành cho các nhu cầu thiết yếu trên chiến trường.', 'Những túi quân trang này được làm từ dạ dày bò. Vật liệu đặc biệt này vừa có khả năng chống nước, co giãn tốt, còn có khả năng tự động nổi lên khi rơi xuống dòng nước.', 'Biến sở thích du mục thành nội dung huấn luyện quân đội', 'Chế độ quân đội dưới thời Thành Cát Tư Hãn còn sở hữu một thứ vô cùng trọng yếu. Vị Đại hãn kiệt xuất này đã đem niềm yêu thích của dân du mục trở thành một hình thức huấn luyện quân sự. Đó chính là sở thích vận động, săn bắn.', 'Hình thức huấn luyện săn mồi sẽ giúp các binh sĩ rèn luyện khả năng sinh tồn và tinh thần phối hợp tác chiến. Con mồi được dùng trong huấn luyện cũng rất đa dạng, từ tuần lộc cho đến lợn rừng, chó sói…', 'Các khóa huấn luyện đi săn thường diễn ra vào mùa đông, kéo dài 3 tháng. Đây là hình thức huấn luyện bắt buộc và yêu cầu tất cả các binh sĩ đều phải tham gia.', 'Căn cứ theo quy mô lớn nhỏ của các đội, tướng lĩnh sẽ áp dụng các loại chiến thuật khác nhau.', 'Một phân đội nhỏ có thể dàn trận thành hình cánh cung. Các binh lính trong đội hình sẽ mai phục, dẫn dụ con mồi vào đội hình tập kích. Khi con mồi đã lọt vào bẫy, những người mai phục xung quanh sẽ lập tức bao vây và hạ thủ.', 'Ngụy trang và đánh lừa là chiến thuật nổi bật của quân Mông Cổ, thậm chí giúp họ thu về không ít chiến thắng trên sa trường.', 'Bên cạnh đó, một loại trận hình thường dùng khác của quân Mông Cổ còn được biết tới với tên gọi "trường xà trận". Trường xà trận đặc biệt hữu dụng khi tác chiến ở sườn núi. Đại hãn và quan lại cao cấp ở trên đỉnh núi có thể chứng kiến toàn bộ quá trình dàn trận và tấn công.', 'Cụ thể, binh lính sẽ từ điểm đầu tiên tập hợp và xếp thành một hàng dài, có lúc trải dài tới 130 cây số. Khi có tín hiệu, toàn bộ quân lính với đầy đủ khí giới sẽ lập tức phóng tới điểm cuối, đội hình lúc này chuyển sang hình cung, tựa như con rắn đang uốn cong mình để ngậm lấy đuôi.', 'Đoàn quân sẽ quét sạch toàn bộ những con mồi trên đường đi, dồn chúng vào vòng vây. Điểm đáng nói là từ khi dàn trận cho tới lúc bao vây, tập hợp, binh lính tuyệt đối không được ra tay giết chết con mồi, càng không được phép để con mồi chạy thoát khỏi vòng vây.', 'Trong toàn bộ quá trình này, tướng lĩnh sẽ theo sau binh lính để theo dõi, hướng dẫn và chỉ huy hành động của họ.', 'Sau khi toàn bộ con mồi đã bị dồn vào điểm cuối, Đại hãn sẽ tiến vào vòng vây, chọn cho mình một con mồi để hạ thủ. Đây là một hình thức khích lệ tinh thần chiến đấu của binh sĩ, bởi họ sẽ được chứng kiến tài nghệ của người lãnh đạo tối cao.', 'Sau đó, Đại hãn sẽ lên núi, nhường cho các binh lính những con mồi còn lại. Vào lúc này, mỗi người đều có cơ hội thể hiện bản thân trước mặt tướng lĩnh. Họ có thể dùng kiếm, cung tên hoặc trường mâu để phô diễn tài nghệ của mình khi hạ con mồi.', 'Sau cùng, người già và trẻ em sẽ thỉnh cầu Đại hãn đem những con mồi còn sống phóng sinh. Cuộc đi săn cũng chính thức kết thúc sau nghi thức phóng sinh này.', 'Bên cạnh cưỡi ngựa, bắn cung và kiếm thuật, các binh lính Mông Cổ còn được rèn luyện về tính kỷ luật vô cùng nghiêm khắc, phải luôn phục tùng tuyệt đối mệnh lệnh của cấp trên và phối hợp linh hoạt với nhau.', 'Mặc dù những chiến thuật của họ về mặt bản chất không khác biệt so với chiến thuật của các bộ lạc du mục, nhưng chính mưu lược và sự sáng tạo đã khiến quân đội của họ phát triển vượt bậc.'],
        findItemByName(categories, 'Thế Giới'),
        null,
        'TRẦN QUỲNH, THEO TRÍ THỨC TRẺ',
        '2017-12-16T13:31:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/photo1513436263707-1513436263707.jpg',
        'Lương Xuân Trường: "Thắng Thái Lan chưa nói lên điều gì"',
        ['Sau khi giành hạng 3 chung cuộc tại giải giao hữu quốc tế Cúp M-150 tại Thái Lan, 18h00 tối nay 16/12, đội tuyển U23 Việt Nam đã có mặt Hà Nội. Nhiều bài học quý báu cho từng cá nhân đã được các tuyển thủ rút ra sau 3 trận đấu ở sân chơi này.', 'Chỉ khoảng gần 1 tiếng sau khi chuyến bay VN614 hạ cánh, toàn bộ các thành viên của đội tuyển U23 Việt Nam đã hoàn tất việc làm thủ tục nhập cảnh và lấy hành lý để ra về.', 'Khác với nhiều giải đấu trước đây, đội tuyển U23 Việt Nam trở về trong sự lặng lẽ khi không có sự đón tiếp nồng nhiệt của người hâm mộ hay giới truyền thông trong chiều tối ngày 16/12. Thay vào đó, chỉ có đại diện của các phòng ban chức năng của VFF chờ đón họ tại sảnh A2 sân bay Nội Bài.', 'Tuy nhiên, không vì lý do này mà HLV Park Hang Seo hay tinh thần của các tuyển thủ tỏ ra kém vui, mà trái lại toàn bộ các thành viên của đội tuyển U23 cho thấy sự thoải mái và vui vẻ sau chuyến thi đấu tại Thái Lan.', '"Đây là một giải đấu thực sự bổ ích cho đội tuyển U23 Việt Nam trước quá trình chuẩn bị cho VCK U23 châu Á. Từng cầu thủ đã có dịp nhìn nhận lại khả năng của mình và toàn đội cũng đã bộc lộ ra những ưu điểm hoặc nhược điểm trong cách phối hợp và lối chơi khi thi đấu thực tế. Đây là điều thực sự cần thiết cho đội tuyển U23 ở thời điểm này và tôi cảm thấy rất hài lòng về những gì mà mình đã gặt hái được ở giải đấu vừa qua", đội trưởng Lương Xuân Trường chia sẻ tại sân bay.', 'Cũng theo lời của Xuân Trường, ngoài các bài học về chuyên môn, chiến thắng trước đội tuyển U23 Thái Lan cũng để lại nhiều cảm xúc cho cá nhân tiền vệ này và đem đến tác động tích cực về mặt tinh thần cho toàn bộ các đồng đội khác.', '"Bản thân tôi đến thời điểm này cũng chưa quên được thất bại 0-3 trước Thái Lan ở SEA Games 29 và nhiều đồng đội khác cũng vậy. Vì thế trước giờ vào cuộc, chúng tôi dù không ai nói với ai song tất cả đều thể hiện quyết tâm cao, cố gắng có được thể hiện tốt nhất trước đối thủ này và điều đó đã được thể hiện qua màn trình diễn của đội và kết quả của trận đấu", thủ quân của U23 Việt Nam cho biết.', '"Còn một lý do khác khiến U23 Việt Nam đá tốt hơn ở trận gặp U23 Thái Lan so với 2 trận đấu trước là nền tảng thể lực của toàn đội đã được củng cố và tích lũy. Hai trận đấu trước thể lực của đa số các cầu thủ Việt Nam chưa tốt là do toàn đội vừa trải qua giáo án khá nặng và điều này khiến lối chơi có cảm giác nặng nề, chưa được thanh thoát", Xuân Trường lý giải về màn trình diễn khá ấn tượng của U23 Việt Nam ở trận đấu tranh hạng ba chung cuộc tại Cúp M-150.', '"Chúng ta đã đánh bại được Thái Lan ở giải đấu vừa qua nhưng điều đó chưa nói lên nhiều điều. Tôi cũng không muốn so sánh trình độ chuyên môn giữa cầu thủ của chúng ta với họ là ai hơn ai kém, mà điều đó nên để các nhà chuyên môn đánh giá.', 'Dưới góc độ cá nhân, tôi cho rằng, tinh thần quyết tâm và sự tự tin là chìa khóa để U23 Việt Nam giành chiến thắng, bởi đây là 2 yếu tố quan trọng, quyết định tới kết quả trận đấu này", Xuân Trường chia sẻ thêm.', 'Theo kế hoạch, sau khi trở về Hà Nội, đội tuyển U23 sẽ có một ngày nghỉ ngơi, trước khi trở lại sân tập để chuẩn bị cho trận giao hữu với CLB Ulsan Huyndai (Hàn Quốc) vào ngày 21/12 tại sân Hàng Đẫy.', 'Đây là quãng thời gian mà Xuân Trường với các đồng đội sẽ tập trung khắc phục những nhược điểm khi vận hành sơ đồ chiến thuật 3-4-3, đồng thời, HLV Park Hang Seo sẽ có thêm các thử nghiệm nhân sự để tìm ra nhân tố phù hợp nhất cho chiến thuật này.'],
        findItemByName(subCategories, 'Đá Bóng'),
        null,
        'VŨ LÊ, THEO THỂ THAO & VĂN HÓA ',
        '2017-12-16T21:59:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/cp0715-sp-diego-maradona-07-1513423407094.jpg',
        'Maradona: "Bảo Ronaldo ngừng làm trò hề đi"',
        ['"Nói với cậu ta ngừng làm trò đi", Maradona nói với truyền thông gần đây khi được hỏi về Cristiano Ronaldo. "Nếu cậu ta là người xuất sắc nhất thì tôi là gì. Từ những người mà tôi từng chứng kiến, giỏi nhất phải kể đến Di Stefano, Cruyff, Messi. Cristiano Ronaldo cũng có thể được xếp vào danh sách".', 'Ronaldo vừa giành Quả bóng vàng thứ 5 trong sự nghiệp, cùng với Lionel Messi trở thành những cầu thủ giành nhiều danh hiệu cá nhân này nhất lịch sử. Maradona từng được xem là một trong những cầu thủ vĩ đại nhất, bên cạnh Pele. Nhưng ông chưa từng giành Quả bóng vàng vì danh hiệu này không trao cho cầu thủ ngoài châu Âu trước năm 1990.', 'Sau khi nhận Quả bóng vàng 2017, Ronaldo tuyên bố: "Tôi là cầu thủ xuất sắc nhất lịch sử, cả những lúc phong độ cao hay lúc chơi tệ. Tôi chưa thấy cầu thủ nào giỏi hơn tôi. Không ai hoàn hảo như tôi. Không ai có thể làm những điều tôi làm. Tôi chơi tốt cả hai chân. Tôi có tốc độ, sức mạnh, có thể chơi đầu giỏi, tôi ghi bàn, tôi kiến tạo. Không một ai có nhiều danh hiệu cá nhân như tôi, phải không".', 'Maradona từng đăng quang World Cup 1986 cùng tuyển Argentina.'],
        findItemByName(subCategories, 'Đá Bóng'),
        null,
        'BẢO BẢO, THEO TRÍ THỨC TRẺ',
        '2017-12-17T21:59:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/2547415216782338421982821387748643o-1513413142649-1513561424330.jpg',
        'Người vợ chính là nghi phạm vụ sát hại, vứt đầu người đàn ông trong thùng rác ở Bình Dương',
        ['Công an tỉnh Bình Dương đã xác định danh tính người đàn ông bị sát hại, vứt đầu trong bịch nylon và nghi phạm gây án chính là vợ của nạn nhân.', 'Ngày 18/12, Công an TX.Dĩ An phối hợp với Công an tỉnh Bình Dương đã xác định được danh tính nạn nhân vụ đầu người trong thùng rác là ông Trần Thanh Tú (37 tuổi, ngụ tỉnh Sóc Trăng) và nghi phạm của vụ việc là người vợ Hàng Thị Hồng Diễm (32 tuổi, ngụ tỉnh Hậu Giang).', 'Đại tá Trần Văn Chính - Phó giám đốc Công an tỉnh Bình Dương cho biết, nguyên nhân ban đầu được xác định là do mâu thuẫn tình cảm. Người vợ cũng là nghi phạm đang bị tạm giữ để lấy lời khai.', 'Trước đó, ngày 16/12, tại đường Thuận Giao 09, khu phố Bình Thuận 2, phường Thuận Giao, một người thu gom rác trước nhà trọ T16/3, phát hiện có chiếc balô bỏ trong thùng rác. Khi mở ra thì bàng hoàng thấy một đầu người còn dính máu, bên cạnh có một chiếc bọc nhỏ đựng lá phổi.', 'Đêm 17/12, Công an cũng tìm thấy túi đựng nhiều bộ phận thi thể người được đựng trong nhiều bịch ni lông cách nơi phát hiện đầu người khoảng 1km cách hiện trường.'],
        findItemByName(categories, 'Xã Hội'),
        findItemByName(hotTopics, 'Vợ Giết Chồng Rồi Phân Xác Phi Tang'),
        'MINH TUỆ, THEO THỜI ĐẠI',
        '2017-12-18T08:18:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/2557704111540746447274651531612538o-1513577580907.jpg',
        'Vụ vợ sát hại, vứt đầu chồng vào thùng rác: Cả khu trọ bàng hoàng, nhiều người chuyển tạm nơi khác vì mùi hôi thi thể',
        ['Sau khi biết tin người vợ chính là nghi phạm sát hại, vứt đầu chồng vào thùng rác rồi phân xác phi tang, những người sống ở khu trọ đã bị ám ảnh, chuyển đi nơi khác ở tạm.', 'Khu trọ bốc mùi, nhiều người ám ảnh chuyển đi nơi khác', 'Như trước đó đã đưa tin, vào khoảng 12h ngày 16/12, nhân viên môi trường tên Nguyễn Văn Tiến (SN 1985, quê An Giang) đi lấy rác tại đường Thuận Giao 09, khu phố Bình Thuận 2, phường Thuận Giao, thị xã Thuận An, Bình Dương bất ngờ phát hiện một ba lô màu xanh còn mới và rất nặng.', 'Nghi ngờ bên trong chứa đồ lạ, người này mở ra kiểm tra thì thấy bên trong có một bao nilon màu đen. Tháo chiếc bao, nam nhân viên hoảng hốt khi nhìn thấy một đầu người.', 'Sau quá trình điều tra, công an tiến hành bắt giữ vợ của nạn nhân tên Hàng Thị Hồng Diễm (32 tuổi, ngụ tỉnh Hậu Giang) tại phòng trọ cách hiện trường khoảng 1,5km (đường Thuận Giao 05, KP. Bình Thuận 1).', 'Những người sống ở khu trọ nơi nghi phạm sát hại chồng còn bị ám ảnh, chuyển đi nơi khác ở tạm.', 'Chia sẻ với chúng tôi, anh Tuấn cho biết, anh ở sát phòng trọ của vợ chồng Diễm nên rất bất ngờ sau khi biết được nghi phạm đã sát hại chồng. Theo anh Tuấn, thường ngày hai vợ chồng Diễm sống hoà thuận, rất ít khi anh nghe hai vợ chồng xích mích.', '"Chỉ mới tối hôm thứ 6 (ngày 15/12) đây, tôi có nghe hai vợ chồng lớn tiếng cự cãi với nhau, nghĩ chuyện bình thường nên không để ý lắm. Sáng hôm sau thì nghe tin có một đầu người nhưng tôi cũng không nghĩ nghi phạm là Diễm. Đến khi công an bắt giữ chị ta tôi mới biết và rất bất ngờ, ám ảnh", anh Tuấn nói.', 'Theo anh Tuấn, hiện tại cả khu trọ ai cũng bàng hoàng. Tại đây vẫn còn bịch nilon dính máu, bỏ vào thùng rác, bốc mùi nồng nặc. "Bây giờ đỡ rồi chứ mới lúc công an ập vào lục soát phát hiện nhiều phần thi thể người còn bốc mùi hơn", một người dân nói.', 'Mở rộng điều tra để xác định có đồng phạm tiếp tay hay không', 'Chia sẻ với chúng tôi, ông Đại hàng xóm sống gần dãy trọ cho hay, hai vợ chồng từ quê miền Tây lên Bình Dương sinh sống, thuê trọ ở đường Thuận Giao 05 được khoảng 8 năm. Cả hai vợ chồng làm công nhân tại một công ty gần đó được một thời gian khá lâu.', 'Được biết, người chồng thì được làm tổ trưởng, quản lí trong một bộ phận của công ty. Còn người vợ làm công nhân bình thường.', 'Ông Đại còn nhấn mạnh, anh Tú là một người khá hiền lành, chịu khó và rất hòa đồng với những người xung quanh. Riêng nghi phạm Hàng Thị Hồng Diễm thì lại rất ít nói và gần như không tiếp xúc với những hàng xóm sống quanh dãy trọ.', 'Cả hai vợ chồng cũng đã có với nhau được 2 người con. Người con gái lớn năm nay được 14 tuổi, con trai út 8 tuổi và cả hai cháu đang sống ở quê cùng người thân.', 'Đêm 15/12 trước khi phát hiện đầu người giấu trong ba lô ở thùng rác, nhiều hàng xóm sống gần đó nghe thấy tiếng ồn ào phát ra từ phòng của hai vợ chồng. Nghĩ là chuyện vợ chồng cãi nhau nên mọi người cũng không để ý và quan tâm.', '"Tôi rất bất ngờ và ám ảnh. Thằng Tú chịu khó hiền lành mà lại bị chính người đầu ấp tay gối sát hại dã man", ông Đại nói.', 'Cũng theo hàng xóm cho hay, sau khi xảy ra án mạng, người vợ cũng không có hành động gì bất thường.', 'Hiện công an vẫn đang tiếp tục lấy lời khai nghi phạm để mở rộng điều tra xem có đồng phạm nào giúp sức cho nghi phạm để thực hiện hành vi hay không.'],
        findItemByName(categories, 'Xã Hội'),
        findItemByName(hotTopics, 'Vợ Giết Chồng Rồi Phân Xác Phi Tang'),
        'TỨ QUÝ, THEO THỜI ĐẠI ',
        '2017-12-18T13:09:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/photo-1-1513645137966.jpg',
        'Vụ vợ sát hại chồng phi tang xác: Chưa xác định có đồng phạm',
        ['Trả lời thông tin về 1 số trang mạng cho rằng Công an đang tạm giữ đồng phạm của Diễm, Đại tá Trần Văn Chính, Phó Giám đốc Công an tỉnh Bình Dương cho biết, đến thời điểm này cơ quan điều tra vẫn chưa xác định có đồng phạm trong vụ án mạng. Một số thông tin cho rằng công an tạm giữ đồng phạm của Diễm trong vụ án là không chính xác.', 'Theo Đại tá Chính, hiện cơ quan công an vẫn đang tiếp tục điều tra mở rộng vụ án và có làm việc một số người thân của nghi can để làm rõ các mối quan hệ, củng cố hồ sơ. Hoàn toàn không có việc tạm giữ đồng phạm của Diễm.', 'Như trước đó đã đưa tin, tại cơ quan điều tra, nghi phạm Hàng Thị Hồng Diễm khai nhận: vào đêm 15/12/2017, sau khi anh Trần Thanh Tú (chồng Diễm, quê Sóc Trăng) đi nhậu về thì giữa Tú và Diễm xảy ra mâu thuẫn dẫn đến ẩu đả. Trong lúc giằng co, Diễm đã dùng dao chém anh Tú tử vong.', 'Sau khi nạn nhân chết, Hàng Thị Hồng Diễm dùng dao phân chia thi thể anh Tú ra làm nhiều phần nhỏ, sau đó, đem bỏ tại các điểm tập kết rác trên địa bàn phường Thuận Giao để phi tang.', 'Hiện Cơ quan Cảnh sát điều tra Công an tỉnh Bình Dương vẫn đang tích cực tìm kiếm các phần thi thể còn lại của anh Trần Thanh Tú, thu thập tài liệu, chứng cứ để xử lý vụ án theo quy định của pháp luật.'],
        findItemByName(categories, 'Xã Hội'),
        findItemByName(hotTopics, 'Vợ Giết Chồng Rồi Phân Xác Phi Tang'),
        'UYÊN CHÂU, THEO INFONET',
        '2017-12-19T08:30:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/photo-1-1513741121693.jpg',
        'Thêm tình tiết mới vụ chặt đầu chồng bỏ thùng rác',
        ['Người vợ khai bị chồng đánh, đòi giết, cùng đường nên mới giết chồng. Tuy nhiên, hàng xóm cho biết có nghe người chồng thều thào: "Trời ơi, trời ơi..., xin đừng giết tôi".', 'Sáng 19-12, đại tá Trần Văn Chính - Phó Giám đốc, Thủ trưởng Cơ quan CSĐT Công an tỉnh Bình Dương - đã chủ trì họp báo về một số vụ trọng án xảy ra tại địa phương thời gian qua. Đáng chú ý nhất là vụ vợ chặt đầu chồng bỏ thùng rác được phát hiện vào trưa 16-12.', 'Theo đó, trong 2 ngày 16 và 17-12, người dân phát hiện đầu người và nhiều bộ phận cơ thể người trong thùng rác ở phường Thuận Giao, thị xã Thuận An, tỉnh Bình Dương. Sau đó, công an xác định nạn nhân là anh Trần Thanh Tú (37 tuổi, quê Sóc Trăng). Người dân trong khu anh Tú ở trọ tại phường Thuận Giao cho biết tối 15-12, họ có nghe tiếng cãi vã, đánh nhau giữa anh Tú và vợ là Hàng Thị Hồng Diễm (32 tuổi, quê Hậu Giang). Công an đã mời Diễm về đồn làm việc và qua đấu tranh liên tục, đến 1 giờ ngày 18-12, cô ta khai nhận đã giết chồng.', 'Diễm khai đêm 15-12, sau khi đi nhậu về, anh Tú đánh, đe dọa giết vợ. Trong lúc đánh vợ, anh Tú dùng dao bầu chém nhưng Diễm né và giật được dao, chém lại trúng cổ chồng. Diễm khai: "Sau khi bị chém, anh Tú vật ngã xuống nền nhà, dùng chân đạp vào người tôi và nói "tao mà chết thì thôi, nếu tao còn sống thì mày cũng chết"". Nghe vậy, Diễm tiếp tục chém nhiều nhát đến khi chồng nằm im thì dừng lại. Sau đó, Diễm dùng con dao cắt xác nạn nhân thành nhiều phần, cho vào bịch ni-lông rồi sáng hôm sau đem bỏ ở nhiều nơi.', 'Tuy nhiên, chiều 19-12, trao đổi với phóng viên Báo Người Lao Động, anh Huỳnh Trung Tính (ở chung khu trọ với nạn nhân) cho biết trước lúc chết, anh Tú có van xin vợ tha mạng. Tính kể khoảng 23 giờ ngày 15-12, vợ chồng anh nghe tiếng động mạnh ở phòng anh Tú. "Khoảng 15 phút sau, tôi đi ngang qua phòng thì nghe anh Tú thều thào "trời ơi, trời ơi..., xin đừng giết tôi"". Nghĩ là anh Tú say nói nhảm nên anh Tính đi thẳng về phòng ngủ.', 'Theo luật sư Nguyễn Văn Tiến, Đoàn Luật sư TP HCM, nếu lời khai của người vợ là đúng thì cơ quan điều tra có thể xem xét truy tố tội "Giết người do vượt quá giới hạn phòng vệ chính đáng" (mức án tối đa 2 năm tù). "Tuy nhiên, nếu lời nhân chứng là đúng thì rõ ràng người chồng đã không thể kháng cự mà người vợ vẫn cố giết rồi phân xác là đã phạm tội "Giết người" với tình tiết man rợ, có khung hình phạt cao nhất là tử hình" - luật sư Tiến nhận định. Ông kiến nghị cơ quan điều tra xem xét kỹ vụ án để không truy tố nhầm tội danh.', 'Chưa phát hiện đồng phạm', 'Đại tá Trần Văn Chính khẳng định một số trang mạng thông tin rằng công an đã bắt đồng phạm trong vụ án là không đúng sự thật.', '"Từ hơn 23 giờ, đối tượng bắt đầu phân xác nạn nhân bỏ vào các bọc ni-lông. Đến 8 giờ hôm sau, đối tượng đưa các bọc chứa xác đi bỏ các nơi. Suốt 9 giờ, một mình Diễm có thể làm được các việc đó. Còn việc có người khác giúp sức, đồng phạm hay không, cơ quan điều tra sẽ tiếp tục làm rõ. Trước mắt, dựa trên tài liệu, chứng cứ bây giờ thì chỉ có mình Diễm gây án" - đại tá Chính phân tích.'],
        findItemByName(categories, 'Xã Hội'),
        findItemByName(hotTopics, 'Vợ Giết Chồng Rồi Phân Xác Phi Tang'),
        'NHƯ PHÚ, THEO NGƯỜI LAO ĐỘNG ',
        '2017-12-20T10:52:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/photo-1-1513672852951.jpg',
        'Cộng đồng fan SHINee xôn xao tin người hâm mộ khắp thế giới tìm đến cái chết sau khi nghe tin buồn của Jonghyun',
        ['Tuy rằng thông tin này chưa được xác thực, song nhiều netizen bày tỏ mong muốn các fan hãy sát cánh bên nhau, vượt qua mạnh mẽ cú sốc này.', 'Trong lúc cả làng giải trí bàng hoàng trước sự ra đi đột ngột của Jonghyun thì Shawols (cộng đồng fan chính thức của SHINee) lại xôn xao thông tin nhiều người hâm mộ tự kết liễu đời mình sau khi nghe tin thần tượng qua đời. Theo thông tin được lan truyền trên mạng xã hội, hiện tại đã có 5 fan Chile, 1 fan Mỹ, 1 fan nữ tại Hàn và 1 master fansite người Nhật tự tử. Con số này đang ngày một tăng lên khiến mọi người càng thêm lo lắng về sự nghiêm trọng của vấn đề.', 'Chưa xác định được tính thực hư của của thông tin này nhưng đây được đánh giá là vấn đề đáng quan ngại, nhất là đối với bộ phận người hâm mộ quá xúc động, không kiềm chế nổi bản thân sau khi nghe tin buồn của Jonghyun. Các fan cũng thay phiên cổ vũ nhau rằng tuyệt đối không được suy sụp và phải luôn giữ vững tinh thần để cùng nhau vượt qua khó khăn hiện tại cũng như mạnh mẽ hơn vì các thành viên còn lại.', 'Sự việc xảy ra với Jonghyun là điều tất cả làng giải trí và người hâm mộ đều bàng hoàng và xót xa. Tuy nhiên, thay vì có những suy nghĩ tiêu cực, các fan hãy cùng sát cánh bên nhau, mạnh mẽ vượt qua cú sốc này. Hơn ai hết, nỗi buồn mà người ở lại phải gánh chịu đã vô cùng đau đớn. Fan vì thần tượng mà nghĩ quẩn, dẫn tới tự huỷ hoại mạng sống của mình, chắc chắn thần tượng cũng sẽ đau lòng và không muốn chuyện này xảy ra..'],
        findItemByName(subCategories, 'Sao Hàn'),
        findItemByName(hotTopics, 'Jonghyun (SHINee) Tự Tử'),
        'VILU, THEO TRÍ THỨC TRẺ ',
        '2017-12-19T15:54:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/4-1513687021222.jpg',
        'Câu chuyện về hình xăm mang ý nghĩa trầm cảm và lời tạm biệt cuối cùng của Jonghyun khiến netizen càng thêm xót xa',
        ['Biết được sự thật đằng sau những hình xăm này, fan của Jonghyun càng thêm đau đớn và thương xót cho thần tượng.', 'Sự ra đi bất ngờ của Jonghyun (SHINee) khiến cả làng giải trí châu Á bàng hoàng và xót xa. Bức di thư tuyệt mệnh của thành viên SHINee gửi cho chị gái và các fan được truyền tay nhau với tốc độ chóng mặt. Jonghyun đã ra đi vì căn bệnh trầm cảm, về những dằn vặt và trăn trở trong suốt thời gian dài không lối thoát và đơn độc.', 'Và rồi, khi sự việc đau thương vẫn đang khiến showbiz châu Á xót xa và đau lòng, thì các fan nhận ra dường như Jonghyun đã từng có một hình xăm với ẩn ý anh đang mắc căn bệnh trầm cảm. Hình xăm với ý nghĩa đầy đủ là: "Tôi có một chú chó đen, tên nó là Trầm Cảm", được xăm ngay tại mạng sườn bên trái.', 'Bên cạnh đó, thợ xăm riêng của Jonghyun đã có tiết lộ gây sốc, đó chính là việc nam ca sĩ đã muốn hình xăm cuối cùng bản thân muốn thực hiện chính là chữ "BYE" có nghĩa là "TẠM BIỆT".', ''],
        findItemByName(subCategories, 'Sao Hàn'),
        findItemByName(hotTopics, 'Jonghyun (SHINee) Tự Tử'),
        'VILU, THEO TRÍ THỨC TRẺ ',
        '2017-12-19T21:54:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/photo-1-1513613996022-1513671625754.jpg',
        'Từ vụ Jonghyun tự sát - tại sao những người thành công, sự nghiệp lẫy lừng vẫn bị trầm cảm?',
        ['Những người tưởng như có cả thế giới trong tay, nhưng rồi tự kết liễu cuộc đời mình vì trầm cảm.', 'Ngày 18/12 quả thực là một ngày đau buồn đối với cộng đồng fan của K-pop và làng giải trí châu Á nói chung. Đó là ngày mà Jonghyun - nam ca sĩ, nhạc sĩ tài năng của SHINee đã vĩnh viễn ra đi.', 'Trong lá thư tuyệt mệnh của mình, Jonghyun thừa nhận mình mắc trầm cảm nặng, dẫn đến hành vi tự tử. Nhưng lục lại một sự nghiệp có thể nói là thành công của nam thần tượng, không ai muốn tin rằng anh tuyệt vọng đến mức có thể tự tử được.', 'Trầm cảm là một căn bệnh của sự nghịch lý. Theo thống kê đưa ra từ Forbes, tỉ lệ bị mắc trầm cảm chung trong xã hội là 20%, nhưng ở các CEO thành đạt phải cao hơn gấp đôi - tức 40%. Trẻ em sinh ra trong gia đình giàu có, thượng lưu dễ mắc trầm cảm hơn trẻ em nghèo hoặc có thu nhập thấp. Trầm cảm cũng phổ biến hơn ở các quốc gia phát triển giàu có, thay vì các nước đang phát triển còn nghèo.', 'Nêu vậy để thấy, trầm cảm có thể xảy ra với tất cả mọi người, mọi độ tuổi, mọi nền văn hóa, và mọi nền tảng kinh tế. Chẳng ai miễn nhiễm với nó, kể cả những người tưởng như đã đạt được nhiều thành tựu đáng nể trong cuộc sống.', 'Xu hướng chung của xã hội thường khó lòng cảm thông với những vấn đề tâm lý mà một người thành đạt có thể gặp phải. Như trường hợp của Jonghuyn, người ta khóc thương khi anh tự tử, nhưng có mấy ai hiểu được nguyên nhân nào đã khiến anh rơi vào hoàn cảnh đó đâu?', 'Sự cạnh tranh quá gay gắt', 'Deborah Serani, bác sĩ tâm lý nổi tiếng của Hoa Kỳ từng chia sẻ như sau: "Bệnh nhân của tôi có rất nhiều người thành đạt, và đối với tôi chẳng có lý do gì khiến họ miễn nhiễm với trầm cảm cả."', '"Khi bạn đến từ một đất nước quá xịn, sự cạnh tranh là cực kỳ lớn, cũng như cảm giác thất bại sẽ luôn xâm chiếm tâm trí của họ." ', 'Với trường hợp của Jonghyun, áp lực với anh chắc chắn không hề nhỏ. Trong một nền giải trí khốc liệt nhất thế giới, sóng sau xô sóng trước, SHINee cũng như nhiều thế hệ idol thứ 2 đã dần lụi tàn. Bản thân Jonghyun, dù rất cố gắng, nhưng để giữ được độ hot của tên tuổi không phải là chuyện đơn giản. ', 'Áp lực từ thế hệ kế cận, áp lực từ công ty chủ quản, áp lực từ chính bản thân... Áp lực dồn nén là con đường ngắn nhất dẫn đến trầm cảm, khoa học đã chứng minh từ rất lâu rồi.', 'Không còn thời gian để quan tâm đến những việc nhỏ nhặt', 'Để đạt được đến thành công là cả một sự nỗ lực không ngừng. Nhưng điểm chung giữa những người thành công là họ thường xuyên rất bận, đến mức chẳng thể tập trung vào những điều cơ bản trong cuộc sống. Và thứ còn lại với họ ở trên đỉnh cao lại là cảm giác của sự cô đơn.', '"Người bình thường có nhiều mối lo, nhưng chúng ta thậm chí có thể tận hưởng điều đó. Bạn nói xấu người này người kia, ca cẩm mọi chuyện với bạn bè. Nhưng khi vượt hẳn lên, mọi thứ bắt đầu thay đổi. Mọi thứ dần mất đi sự kết nối vốn có, kể cả những thứ đơn giản nhất." - Serani cho biết.','"Những bữa cơm gia đình dần trở nên xa xỉ, những cuộc trò chuyện với bạn bè dần ngắn lại và không còn nữa." ', '"Đó đều là những thứ tô màu cho cuộc sống của bạn; nhưng những người quá thành công, họ có thể phải làm việc 24/7, chẳng có thời gian cho chúng."', 'Cảm giác xa lạ với chính bản thân mình', 'Khi trở nên quá thành công và giàu có, nhiều người dường như cảm thấy xa lạ với chính bản thân mình. Một bệnh nhân từng nói với Serani rằng: "Càng có nhiều tiền, tôi càng thấy bản thân không giống như trước nữa."', 'Những mối quan hệ mới, những cuộc chơi của người có tiền, có thể tạo ra một thứ áp lực không tên. Và khi tất cả qua đi, mọi thứ để lại là cảm giác trống rỗng.', 'Áp lực khủng khiếp từ ngành nghề đang làm', 'Theo bác sĩ tâm lý Greg Dillon từ New York, bản chất của ngành nghề cũng mang đến nguy cơ trầm cảm khác nhau. "Tôi thấy rất nhiều anh chàng từ các công ty lớn, họ trượt dài khi mọi chuyện xấu đi. Họ thực sự trượt dài."', 'Những người thành công trong nhiều năm sẽ thấu hiểu điều này - Dillon cho biết. Ngay cả khi các con số thống kê khả quan, nhưng mục tiêu thực sự họ đang hướng đến chưa chắc đã là như vậy. Giá trị của mỗi người, và cả mục tiêu của họ cũng thay đổi qua thời gian. Khi không đạt được kỳ vọng, cảm giác buồn bực, thất vọng sẽ ập đến. ', 'Và cuối cùng: định nghĩa của sự thành công', 'Bạn nghĩ thế nào là thành công?', 'Caroline Myss - tác giả đã 5 lần đạt danh hiệu bestseller của NY Times cho rằng khái niệm thành công của chúng ta hiện tại giống như một ảo tượng dựa trên quan điểm của người khác. ', 'Chúng ta nhìn vào cuộc sống của một người, lấy tiền bạc, gia đình, vẻ hào nhoáng bên ngoài và cho rằng họ thành công. Tương tự, ta cũng dựa trên những gì người khác đạt được để đánh giá về bản thân mình.', 'Nhưng thành công đâu phải như vậy? Thành công thực chất là những gì chúng ta cảm nhận được, và nó nên hoàn toàn độc lập với mọi thế lực bên ngoài. Bạn hài lòng với cuộc sống của mình - ấy là một thành công tuyệt vời rồi.', 'Thế nên mới có chuyện, chúng ta cảm nhận một người đã thành công, nhưng bản thân họ không phải là người thành công. Cảm giác trống rỗng, thất vọng ngày qua ngày khiến họ ức chế, và rồi khi sự dồn nén lên đến đỉnh điểm, tất cả vỡ tung và gây nên thảm kịch.', '"Tôi chán ghét bản thân mình, tôi cố gắng bấu víu những ký ức rời rạc và hét lên để mong có thể níu kéo tất cả lại, nhưng rốt cuộc chẳng có lời hồi đáp nào.\nNếu như không còn cách nào thoát khỏi cảnh ngột ngạt này, thì tốt nhất nên kết thúc.\nTôi đã chất vấn bản thân rằng ai là người chịu trách nhiệm cho tôi. Hoá ra chỉ có mình tôi. Tôi hoàn toàn cô độc."\nJonghuyn - 2017'],
        findItemByName(subCategories, 'Sao Hàn'),
        findItemByName(hotTopics, 'Jonghyun (SHINee) Tự Tử'),
        'OCT, THEO HELINO ',
        '2017-12-20T21:54:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/hinh-5-1513652678365.jpg',
        'Lương Mạnh Hải kể chuyện suýt tát "con trai" nhân mùa Giáng Sinh',
        ['Trước thềm ra mắt "Khi con là nhà", phim điện ảnh về tình phụ tử mùa Lễ hội cuối năm, Lương Mạnh Hải cùng "con trai" Duy Anh đã thực hiện một bộ ảnh giáng sinh vui nhộn, khác với hình ảnh đen đúa trên phim.', 'Khác với hình ảnh "lầy bựa, khổ cực" trong trailer phim Khi con là nhà, hai cha con Lương Mạnh Hải và bé Duy Anh vừa tung ra bộ ảnh Giáng sinh"trắng sáng" cùng những câu chuyện trên phim trường. ', 'Đây có lẽ là mùa Lễ hội đặc biệt đối với Lương Mạnh Hải vì anh không lên kế hoạch đi chơi mà ở nhà chuẩn bị cho ngày ra mắt của bộ phim điện ảnh Khi con là nhà. Chỉ còn khoảng một tuần nữa là bộ phim chính thức ra mắt truyền thông. Đây cũng là bộ phim đầu tiên của anh phát hành vào dịp lễ hội cuối năm nên anh vừa háo hức vừa hồi hộp.', 'Mặc dù đóng rất nhiều phim trước đó nhưng đây là lần đầu tiên bé Duy Anh đảm nhận một vai chính quan trọng xuyên suốt phim, đồng thời gây ấn tượng ngay từ khi trailer được tung ra. Ở các phim trước, cậu bé cũng từng đóng vai chính nhưng vẫn chưa tạo được dấu ấn. Theo nhà sản xuất thì với Khi con là nhà, trọng trách của Duy Anh có phần đặc biệt hơn hẳn bởi cậu bé là nhân vật nắm giữ mạch cảm xúc chính cho phim.', 'Duy Anh tâm sự: "Đây là lần đầu tiên con vào vai cậu bé nghèo sống ở quê nên có nhiều thứ con chưa được biết. Lần đầu con được một mình dắt heo nọc, được bắt rắn, bắt ếch, lại còn được chơi ném bùn, tắm mưa ở quê... Dù quay rất cực nhưng lại rất vui. Thêm nữa, phim quay nhiều ngày nhưng lại vào mùa hè nên con không bị mất bài vở vì không phải đến trường".', 'Cả đạo diễn Vũ Ngọc Đãng và nhà sản xuất Lương Mạnh Hải đều rất ngạc nhiên về cậu bé sinh năm 2009 này, bởi Duy Anh chỉ mất 5 giây là có thể khóc ngon lành. Chắc hiếm có đứa bé 7-8 tuổi nào làm được tốt như vậy.', 'Khi được hỏi cảnh quay nào ấn tượng nhất với "ông con" của mình, Lương Mạnh Hải chia sẻ: "Trong kịch bản có một phân cảnh, vì giận dữ không kiềm chế được, tôi đã phải tát cu Bi rất mạnh và cu Bi cũng biết sẽ bị cha tát mặc dù không nói ra hay hỏi lại. Đến khi quay, tôi có giơ tay lên chuẩn bị tát thì bỗng chùng lại vì thấy cu Bi đứng khóc thương quá. Tôi thương con thật sự. Lúc đó tôi đặt mình vào nhân vật nên quyết định không đánh con nữa. Đạo diễn Vũ Ngọc Đãng cũng thấy vậy là đủ sự giận dữ rồi, không bắt làm lại. Có những cảm xúc chỉ khi diễn, mình mới cảm nhận được cần phải làm như thế nào là hợp lý".', 'Khi con là nhà được thực hiện bởi bộ đôi Đạo diễn Vũ Ngọc Đãng và nhà sản xuất Lương Mạnh Hải. Bộ phim dự kiến sẽ ra mắt tại các cụm rạp trên toàn quốc từ ngày 28.12.2017.'],
        findItemByName(subCategories, 'Phim Việt Nam'),
        findItemByName(hotTopics, 'Noel 2017'),
        'PHÚC DU, THEO TRÍ THỨC TRẺ ',
        '2017-12-17T10:51:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/img20171218225100274.jpg',
        'Dễ dàng sở hữu cây thông thật 100% trang trí mùa Noel ở Sài Gòn',
        ['38 Flowers Market Tea House vừa cho ra mắt một mặt hàng vô cùng độc đáo cho mùa Giáng sinh này - cây thông thật 100% nhập hoàn toàn từ Mỹ.', 'Ở đất nước với khí hậu nhiệt đới như Việt Nam thì việc có được một cây thông thật để trang trí trong dịp Giáng sinh là chuyện không hề dễ dàng. Tuy nhiên đó là câu chuyện trước đây, bây giờ thì đã có giải pháp vô cùng tuyệt vời dành cho những ai ao ước sở hữu một cây thông Noel ngay tại chính Tp. HCM.', 'Nổi tiếng với việc kinh doanh hoa tươi và gần nhất là kết hợp mô hình thưởng trà, dùng bánh ngọt trong một không gian ngập tràn hoa vô cùng lãng mạn, thương hiệu 38 Flowers Market Tea House mới đây đã tiếp tục khiến khách hàng bất ngờ khi cho ra mắt một mặt hàng vô cùng độc đáo cho mùa Giáng sinh này – cây thông thật 100% nhập hoàn toàn từ Mỹ.', 'Điều đặc biệt là với nhiều kích thước khác nhau và được trang trí cầu kì, đẹp mắt, khách hàng hoàn toàn có thể lựa chọn cho mình một cây thông thật đẹp, thật thơm và hợp giá tiền của mình để trưng bày hoặc dành tặng trong dịp Noel đang cận kề. Song song đó, rất nhiều phụ kiện trang trí cho cây thông Noel tại 38 Flowers Market Tea House như: vòng nguyệt quế, trái châu Noel… cũng đang sẵn sàng chờ bạn đến rinh về.' ,'Và đừng quên một thông tin vô cùng đặc biệt là 38 Flowers Market Tea House sẽ giảm giá 30% cho toàn bộ thông nhập khẩu trong dịp này.', 'Còn chần chừ gì nữa, hãy “note” ngay các địa chỉ của 38 Flowers Market Tea House để chọn cho mình một cây thông thật thơm, thật đẹp nhé!', 'Chi nhánh 1: 62 Phạm Ngọc Thạch, Quận 3, TP.HCM.', 'Chi nhánh 2: 58 Nguyễn Công Trứ, Quận 1, TP.HCM.', 'Chi nhánh 3: 43 Lý Tự Trọng Quận 1, TP.HCM.'],
        findItemByName(categories, 'Xã Hội'),
        findItemByName(hotTopics, 'Noel 2017'),
        'A.D, THEO TRÍ THỨC TRẺ ',
        '2017-12-18T11:00:00Z',
        callback);
    },
    function (callback) {
      articleCreate(
        'images/articles/151375715215559.jpeg',
        'Truyền thống treo ngược cây thông Noel: Câu chuyện Thánh Boniface cứu một bé trai bị hiến tế dưới cây sồi',
        ['Thực ra, ý tưởng treo ngược cây thông Noel không hề mới. Nguồn gốc của nó xuất phát từ truyền thống của những người không theo Thiên chúa giáo. Tuy nhiên, phong tục này lại không phổ biến và thường chỉ xuất hiện tại các trung tâm mua sắm hoặc khách sạn.', 'Việc treo ngược cây thông Noel chắc chắn mang một ý nghĩa nào đó. Nó khiến không gian ngôi nhà bạn rộng rãi hơn, cũng như giảm thiểu nguy hiểm cho trẻ em và thú nuôi trong nhà. Nhưng chi phí để trưng bày theo cách này lại là một vấn đề khác. Vì trái với chuẩn mực nên việc treo ngược cây thông Noel vướng phải nhiều tranh cãi và nhầm lẫn.', 'Theo CBC News, cây thông Noel treo ngược là hình ảnh dễ bắt gặp tại sảnh và giếng trời của nhiều khách sạn, từ London (Anh) cho đến Vancouver (Canada). Đây ắt hẳn là cách trưng bày vô cùng bắt mắt, nhưng mục đích của những người này có thực sự là vì làm theo truyền thống từ thời cổ xưa, hay đó đơn giản là vì mục đích thương mại?', 'Những người theo xu hướng treo ngược cây thông nói rằng, đó là một cách trang trí phổ biến vào thế kỷ 12, ở Đông Âu. Tuy nhiên, điều cần lưu ý ở đây là, phần được treo thường chỉ là đỉnh của cây thông - chứ không phải là nguyên một cây to mà bạn thường thấy ở trung tâm mua sắm hoặc khách sạn hiện nay. ', 'Ở Ba Lan, để chuẩn bị cho bữa tiệc Wigilia (hay Wilia), người ta treo phần ngọn, hoặc một nhánh cây thông xuống lan can. Vị trí thường là đối diện bàn ăn. Các đồ trang trí bao gồm hoa quả, hạt dẻ, kẹo bóng, rơm, băng rôn, quả thông vàng và các vật trang trí khác. Mọi người chỉ được phép thưởng thức các món ăn và đồ ngọt trên cây khi bữa tiệc kết thúc được 1 ngày.', 'Phong tục đặc biệt này được giải thích trong một câu chuyện thần thoại sau: Chuyện kể rằng, vào thế kỷ thứ 8, Thánh Boniface là người đầu tiên treo ngược một cây thông Noel. ', 'Thánh Boniface đã phát hiện những người ngoại đạo đang chuẩn bị đón tiết Đông chí bằng cách hiến tế một bé trai dưới gốc cây sồi (loại cây thiêng liêng trong đạo). Ông ấy vô cùng tức giận trước hành động này và quyết định đốn hạ cái cây đó để cứu đứa trẻ. Sau này, một cây thông mọc lên ở đúng vị trí cây sồi đổ gục và thánh Boniface quyết định treo ngược cây thông. Ông mượn hình dáng tam giác của cây thông để giải thích về Ba Ngôi Thiên Chúa cho những người ngoại giáo, với mục đích dẫn dắt họ đi theo tôn giáo của mình.', 'Một số sử gia nói rằng, cách đây 100 năm, việc trang trí cây thông Noel mới trở nên phổ biến ở một số nước Châu Âu. Lý do là vì, trước đó, người dân ở thế kỷ 19 cần nhiều không gian rộng rãi hơn. Điều này cho thấy, việc treo ngược cây thông cũng có lợi ích của nó.', 'Và các cửa hàng hiện nay cũng đang áp dụng cách làm này. Bằng cách treo ngược cây thông, họ có thêm nhiều không gian hơn để trưng bày những đồ vật khác. Do đó, họ có thể đặt tất cả đồ trang trí ở ngang tầm mắt. Hơn thế nữa, các chủ cửa hàng có thể đặt sản phẩm của họ ở xung quanh phần dưới của cây, hoặc trên các kệ phía sau cây thông.'],
        findItemByName(categories, 'Thế Giới'),
        findItemByName(hotTopics, 'Noel 2017'),
        'BẢO NHI SPIDERUM, THEO THỜI ĐẠI',
        '2017-12-19T21:07:00Z',
        callback);
    }
  ],
    cb);
}

function findItemByName(item_list, name) {
  var item;

  item_list.forEach(function(itm) {
    if (itm.name == name) item = itm;
  });

  return item;
}

async.series([
  createCategories,
  createSubCategories,
  createHotTopics,
  createArticles  
],
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    mongoose.connection.close();
  });




