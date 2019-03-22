import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default class Print {
    onPrint = (divDom) => {
        html2canvas(divDom, {
            useCORS: true,//保证跨域图片的显示
            width: window.screen.availWidth,//显示的canvas窗口的宽度
            height: window.screen.availHeight,//显示的canvas窗口的高度
            windowWidth: divDom.scrollWidth,//获取x方向滚动条中内容
            windowHeight: divDom.scrollHeight,//获取y方向滚动条中内容
            foreignObjectRendering: true,//在浏览器支持时使用ForeignObject渲染
        }).then(function (canvas) {
            var contentWidth = canvas.width;
            var contentHeight = canvas.height;

            //一页pdf显示html页面生成的canvas高度;
            var pageHeight = contentWidth / 595.28 * 841.89;
            //未生成pdf的html页面高度
            var leftHeight = contentHeight;
            //pdf页面偏移
            var position = 0;
            //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
            var imgWidth = 595.28;
            var imgHeight = 595.28 / contentWidth * contentHeight;

            var pageData = canvas.toDataURL('image/jpeg', 1.0);

            var pdf = new jsPDF('', 'pt', 'a4');
            //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
            //当内容未超过pdf一页显示的范围，无需分页
            if (leftHeight < pageHeight) {
                pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
            } else {
                while (leftHeight > 0) {
                    pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                    leftHeight -= pageHeight;
                    position -= 841.89;
                    //避免添加空白页
                    if (leftHeight > 0) {
                        pdf.addPage();
                    }
                }
            }

            pdf.save('report.pdf');
        })
    }
}