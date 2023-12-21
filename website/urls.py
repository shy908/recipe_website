from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage, name=""),

    path('register', views.register, name="register"),

    path('login', views.login, name="login"),

    path('logout', views.logout, name="logout"),

    path('dashboard', views.dashboard, name="dashboard"),
    
    path('upload', views.upload, name="upload"),

    path('recipe', views.recipe_no_id, name="recipe"),
    
    path('recipe/', views.recipe_no_id, name="recipe"),

    path('recipe/<id>', views.recipe, name="recipe"),
    
    path('edit-recipe/<id>', views.edit_recipe, name="edit-recipe"),
        
    path('edit-recipe', views.edit_recipe_no_id, name="edit-recipe"),

    path('edit-recipe/', views.edit_recipe_no_id, name="edit-recipe"),
    
    path('delete-recipe/<id>', views.delete_recipe, name="delete-recipe"),
    
    path('delete-recipe', views.delete_recipe_no_id, name="delete-recipe"),
    
    path('delete-recipe/', views.delete_recipe_no_id, name="delete-recipe"),

    path('activate-recipe/<id>', views.activate_recipe, name="activate-recipe"),
    
    path('activate-recipe', views.activate_recipe_no_id, name="activate-recipe"),
    
    path('activate-recipe/', views.activate_recipe_no_id, name="activate-recipe"),
    
    path('recipes', views.recipes, name="recipes"),

    path('search/', views.search, name="search"),

    path('media-posts', views.api_media_posts, name="media-posts"),
    
    path('dashboard-data', views.api_dashboard_data, name="dashboard-data"),
    
    path('search-data/', views.api_search_data, name="search-data"),
]