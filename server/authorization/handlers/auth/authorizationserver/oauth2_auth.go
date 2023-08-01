package authorizationserver

import (
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/pnnh/multiverse-cloud-server/helpers"
	"github.com/pnnh/multiverse-cloud-server/models"
	"github.com/pnnh/quantum-go/config"

	"github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
)

func parseUsername(gctx *gin.Context) (string, error) {
	authCookie, err := gctx.Request.Cookie("Authorization")
	if err != nil && err != http.ErrNoCookie {
		logrus.Errorln("获取cookie失败", err)
		return "", err
	}
	authedUser := ""
	if authCookie != nil && authCookie.Value != "" {
		jwtToken := strings.TrimPrefix(authCookie.Value, "Bearer ")
		parsedClaims, err := helpers.ParseJwtTokenRs256(jwtToken, PublicKeyString)
		if err != nil && !errors.Is(err, jwt.ErrTokenExpired) {
			return "", err
		}
		if parsedClaims != nil {
			authedUser = parsedClaims.Subject
		}
	}
	return authedUser, nil
}

func AuthEndpointHtml(gctx *gin.Context) {
	ar, err := oauth2.NewAuthorizeRequest(gctx, gctx.Request)
	if err != nil {
		logrus.Printf("Error occurred in NewAuthorizeRequest: %+v", err)
		oauth2.WriteAuthorizeError(gctx, gctx.Writer, ar, err)
		return
	}
	webUrl, _ := config.GetConfigurationString("WEB_URL")
	if webUrl == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("JWT_KEY未配置"))
		return
	}
	selfUrl, _ := config.GetConfigurationString("SELF_URL")
	if selfUrl == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("SELF_URL未配置"))
		return
	}
	// 检查是否已经登录
	authedUser, err := parseUsername(gctx)
	if err != nil {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("username为空3"))
		return
	}
	if authedUser == "" {
		sourceUrl := fmt.Sprintf("%s%s?%s", selfUrl, gctx.Request.URL.Path, gctx.Request.URL.RawQuery)
		sourceUrlQuery := base64.URLEncoding.EncodeToString([]byte(sourceUrl))
		gctx.Redirect(http.StatusFound, fmt.Sprintf("%s%s?source=%s", webUrl, "/account/signin", sourceUrlQuery))
		return
	}
	webAuthUrl := fmt.Sprintf("%s%s?%s", webUrl, gctx.Request.URL.Path, gctx.Request.URL.RawQuery)
	if authedUser != "" {
		webAuthUrl += fmt.Sprintf("&authed=%s", authedUser)
	}

	gctx.Redirect(http.StatusFound, webAuthUrl)
}

func AuthEndpointJson(gctx *gin.Context) {
	ctx := gctx.Request.Context()

	username := gctx.PostForm("username")
	if username == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("username为空2"))
		return
	}
	clientId := gctx.Query("client_id")
	if clientId == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("client_id为空"))
		return
	}

	authedUser, err := parseUsername(gctx)
	if err != nil {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("username为空3"))
		return
	}
	// 若用户名不一致认为是重新登陆
	if username != authedUser {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("出现错误，请重新登陆"))
		return
	}

	ar, err := oauth2.NewAuthorizeRequest(ctx, gctx.Request)
	if err != nil {
		logrus.Printf("Error occurred in NewAuthorizeRequest: %+v", err)
		oauth2.WriteAuthorizeError(ctx, gctx.Writer, ar, err)
		return
	}

	var requestedScopes string
	for _, this := range ar.GetRequestedScopes() {
		requestedScopes += fmt.Sprintf(`<li><input type="checkbox" name="scopes" value="%s">%s</li>`, this, this)
	}
	scopes := gctx.Request.PostForm["scopes"]
	for _, scope := range scopes {
		ar.GrantScope(scope)
	}
	mySessionData := newSession(username)

	response, err := oauth2.NewAuthorizeResponse(ctx, ar, mySessionData)
	if err != nil {
		logrus.Printf("Error occurred in NewAuthorizeRequest: %+v", err)
		oauth2.WriteAuthorizeError(ctx, gctx.Writer, ar, err)
		return
	}

	authCode := response.GetCode()

	session := &models.SessionModel{
		Pk:           uuid.New().String(),
		Content:      "",
		CreateTime:   time.Now(),
		UpdateTime:   time.Now(),
		User:         username,
		Type:         "code",
		Code:         authCode,
		ClientId:     clientId,
		ResponseType: "",
		RedirectUri:  "",
		Scope:        "",
		State:        "",
		Nonce:        "",
		IdToken:      "",
		AccessToken:  "",
	}
	err = models.PutSession(session)
	if err != nil {
		logrus.Printf("Error occurred in NewAccessResponse2222: %+v", err)
		return
	}

	oauth2.WriteAuthorizeResponse(ctx, gctx.Writer, ar, response)
}