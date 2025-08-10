<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'home';
// $route['default_controller'] = 'home/category';
$route['login'] = 'auth/login';
$route['logout'] = 'admin_controller/logout';

$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

// admin dashboard
$route['dashboard'] = 'admin_controller';
$route['forgot-password'] = 'auth/forgot_password_user';
$route['forgot'] = 'auth/forgot_password';
$route['forgot-client/(:any)'] = 'auth/forgot_password_client/$1';

$route['my_friend'] = 'my_friend/welcome';
$route['download'] = 'home/downloadapp';

$route['group/(:any)'] = 'home/change_group/$1';
$route['register-form/(:any)'] = 'home/client_register/$1';
$route['god-register-form/(:any)/(:any)'] = 'home/god_client_register/$1/$2';

$route['partner'] = 'home/client_login';
$route['client-login/(:any)'] = 'home/client_login_group/$1';
$route['media-login/(:any)'] = 'home/media_login_group/$1';
$route['god-login/(:any)/(:any)'] = 'home/god_login_group/$1/$2';
$route['client-form/(:any)/(:any)/(:any)/(:any)'] = 'home/client_register_form/$1/$2/$3/$4';


