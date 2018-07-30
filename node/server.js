// 读取流 -- - - - - - - - - - - - - - - - - - - -- - - - - -- - - - - - - - 

// var fs = require('fs');
// var data = '';

// var readerStream = fs.createReadStream('input.txt');

// readerStream.on('data', function(chunk) {
//     data += chunk;
// });

// readerStream.on("end", function() {
//     console.log(data);
// })

// readerStream.on('error', function(err) {
//     console.log(err.stat);
// })

// console.log("执行程序完毕");

// 写入流- - - - - - - - - -  - - - - - -- - - - - - - - - - - - - - - - - - - - 

// var data = "weifeichang";

// var writeStream = fs.createWriteStream('output.txt')
// writeStream.write(data, 'utf-8');
// writeStream.end();

// writeStream.on('finish', function() {
//     console.log("写入完成");
// })

// writeStream.on("error", function(err) {
//     console.log(err.stat);
// })

// console.log("程序执行完毕！")


// 管道流-  --  -- - - - - - - -- - - - - - - - - - - - - - - - - - -- - - - - --  -- 

// var writeStream = fs.createWriteStream('output.txt');

// readerStream.pipe(writeStream)

// console.log("程序执行完毕！")


// 链式流 - - - - - - - - -- - - - - - - - - - - - - - -- - - - - - - - -- - - - - - - 
// var zlib = require('zlib');

// fs.createReadStream('input.txt')
//     .pipe(zlib.createGzip())
//     .pipe(fs.createWriteStream('input.txt.gz'));

// console.log("程序执行完毕！")

// web -- - - - - - - -- - - - - -- - - - - -- - - -- - - - - -- - - - - -- - - - - - -

// var http = require("http");
// var url = require("url")

// function start (route) {
//     function onRequest(request, response) {
//         var pathname = url.parse(request.url).pathname;
        
//         route(pathname);

//         response.writeHead(200, {'Content-Type':'text/plain'});
//         response.write("hello")
//         response.end();
//     }
//     http.createServer(onRequest).listen(8888);
//     console.log("server has started...")
// }

// exports.start = start;

// crawer -- - - - - - - -- - - - - -- - - - - -- - - -- - - - - -- - - - - -- - - - - - -

var http = require('http')
var cheerio = require('cheerio')

var url = 'http://www.imooc.com/learn/348'
// var url = "http://www.baidu.com"

function filterChapters(html) {
    var $ = cheerio.load(html)
    var chapters = $('.chapter.course-wrap ')
    var courseData = []

    // each 是 jQuery 方法
    chapters.each(function() {
        var chapter = $(this)
        var chapterTitle = chapter.find('h3').text().replace(/\ +/g, "").replace(/[\n]/g, "")
        var videos = chapter.find('.video').children('li')
        var chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        }
        videos.each(function() {
            var video = $(this)
            var videoTitle = video.find('.J-media-item').text().replace(/[\n]/g, "").replace(/\ +/g, "").split('(')[0]
            var id = video.attr('data-media-id')
            chapterData.videos.push({
                title: videoTitle,
                id: id
            })
        })
        // console.log(chapterData.videos)
        courseData.push(chapterData)
    })
    // console.log(courseData.videos)
    return courseData
}

function printCourseInfo(courseData) {
    // forEach 是 js 方法
    courseData.forEach(function(item) {
        var chapterTitle = item.chapterTitle
        console.log(chapterTitle)
        var videos = item.videos
        videos.forEach(function(item) {
            var title = item.title
            var id = item.id
            console.log('    ' + id)
            console.log('    ' + title)

        })
    });
}

http.get(url, function(res) {
    var html = ''

    res.on('data', function(data) {
        html += data
    })
    res.on('end', function() {
        var courseData = filterChapters(html)
        printCourseInfo(courseData)
    }) 

}).on('error', function() {
    console.log('请求出错！')
})
