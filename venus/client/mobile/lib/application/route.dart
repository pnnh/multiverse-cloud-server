import 'package:venus/application/pages/home/home.dart';
import 'package:venus/application/pages/pictures/pictures.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'pages/share/receive.dart';
import 'pages/share/share.dart';

final GoRouter globalRouter = GoRouter(
  initialLocation: '/',
  routes: <RouteBase>[
    GoRoute(
      name: 'home',
      path: '/',
      builder: (BuildContext context, GoRouterState state) {
        return const HomePage();
      },
      routes: <RouteBase>[
        GoRoute(
          name: 'pictures',
          path: 'pictures/:pk',
          builder: (BuildContext context, GoRouterState state) {
            return PicturesPage(folderPk: state.pathParameters['pk'] as String);
          },
        ),
        GoRoute(
          name: 'share',
          path: 'share',
          builder: (BuildContext context, GoRouterState state) {
            return ShareSendPage();
          },
        ),
        GoRoute(
          name: 'receive',
          path: 'receive',
          builder: (BuildContext context, GoRouterState state) {
            return ShareReceivePage();
          },
        ),
      ],
    ),
  ],
);