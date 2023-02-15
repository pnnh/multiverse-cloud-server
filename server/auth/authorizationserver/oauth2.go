package authorizationserver

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"time"

	"github.com/ory/fosite"
	"github.com/pnnh/multiverse-server/config"
	"github.com/sirupsen/logrus"

	"github.com/ory/fosite/compose"
	"github.com/ory/fosite/handler/openid"
	"github.com/ory/fosite/token/jwt"
)

// fosite requires four parameters for the server to get up and running:
// 1. config - for any enforcement you may desire, you can do this using `compose.Config`. You like PKCE, enforce it!
// 2. store - no auth service is generally useful unless it can remember clients and users.
//    fosite is incredibly composable, and the store parameter enables you to build and BYODb (Bring Your Own Database)
// 3. secret - required for code, access and refresh token generation.
// 4. privateKey - required for id/jwt token generation.

var (
	// Check the api documentation of `compose.Config` for further configuration options.
	fositeConfig = &fosite.Config{
		AccessTokenLifespan: time.Minute * 30,
		GlobalSecret:        secret,
		// ...
	}
 
	store = NewDatabaseStore()
 
	secret = []byte("some-cool-secret-that-is-32bytes")
 
	privateKey *rsa.PrivateKey
)

func InitOAuth2() { 
	privateString, ok := config.GetConfiguration("OAUTH2_PRIVATE_KEY")
	if !ok {
		logrus.Fatalln("private key error!")
	}
	block, _ := pem.Decode([]byte(privateString.(string))) //将密钥解析成私钥实例
	if block == nil {
		logrus.Fatalln("private key error!")
	}
	priv, err := x509.ParsePKCS1PrivateKey(block.Bytes) //解析pem.Decode（）返回的Block指针实例
	if err != nil {
		logrus.Fatalln("privateKeyBytes", err)
	}
	privateKey = priv

	oauth2 = compose.ComposeAllEnabled(fositeConfig, store, privateKey) 
}

var oauth2 fosite.OAuth2Provider
 
func newSession(user string) *openid.DefaultSession {
	return &openid.DefaultSession{
		Claims: &jwt.IDTokenClaims{
			Issuer:      "https://fosite.my-application.com",
			Subject:     user,
			Audience:    []string{"https://my-client.my-application.com"},
			ExpiresAt:   time.Now().Add(time.Hour * 6),
			IssuedAt:    time.Now(),
			RequestedAt: time.Now(),
			AuthTime:    time.Now(),
		},
		Headers: &jwt.Headers{
			Extra: make(map[string]interface{}),
		},
	}
}
