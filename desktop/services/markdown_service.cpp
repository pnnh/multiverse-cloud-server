#include "markdown_service.h"
#include "cmark.h"

QString services::markdownToHtml(QString markdownText) {
    auto data = markdownText.toUtf8();
    const char *md = data.constData();
    auto length = strlen(md);
    char *html = cmark_markdown_to_html(md, length, CMARK_OPT_DEFAULT);
    QString htmlText = QString::fromUtf8(html);
    free(html);
    return htmlText;
}