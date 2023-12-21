from django.shortcuts import render, redirect
from django.contrib.auth.models import auth
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.files.storage import default_storage
from django.core import serializers
from django.http import HttpResponse
from django.contrib.auth.models import User
from . forms import CreateUserForm, LoginForm, UploadForm
from . models import MediaUpload


# Create your views here.
def homepage(request):
    return render(request, 'pages/index.html')

def register(request):

    if request.method == "POST":

        registerForm = CreateUserForm(request.POST)

        if registerForm.is_valid():

            registerForm.save()

            return redirect('login')
    else:
        registerForm = CreateUserForm()
        
    context = {'registerForm': registerForm}

    return render(request, 'pages/register.html', context=context)

def login(request):

    if request.method == "POST":

        # authForm = LoginForm(request, data=request.POST)
        authForm = LoginForm(request.POST)

        if authForm.is_valid():

            username = request.POST.get('username')
            password = request.POST.get('password')

            user = authenticate(request, username=username, password=password)

            if user is not None:

                auth.login(request, user)
                return redirect('dashboard')
    else:
        authForm = LoginForm()
            
    context = {'authForm': authForm}

    return render(request, 'pages/login.html', context=context)

def logout(request):

    auth.logout(request)
    return redirect('/')

@login_required(login_url='login')
def dashboard(request):
    return render(request, 'pages/dashboard.html')

@login_required(login_url='login')
def upload(request):

    uploadForm = UploadForm()

    f = None # file to push to the server
    file_name = None
    file_extension = None
    file_type = None
    file_size = None
    file_path = None

    if request.method == "POST" :

        uploadForm = UploadForm(request.POST, request.FILES)

        if uploadForm.is_valid():

            title = request.POST.get('title')
            description = request.POST.get('description')
            uploader_id = request.user.id
            file = request.FILES

            try:
                # f = file['file']
                file_name = file['file'].name
                file_extension = file['file'].name.split('.')[1]
                file_type = file['file'].content_type
                file_size = file['file'].size
                file_path = f'media/{file_name}'

                # upload file to server
                default_storage.save(file_name, f)
            except Exception:
                file_name = ''
                file_extension = ''
                file_type = ''
                file_size = ''
                file_path = ''

            # save to database
            db_upload = MediaUpload.objects.create(
                title=title,
                description=description,
                file_name=file_name,
                file_extension=file_extension,
                file_size=file_size,
                file_type=file_type,
                file_path=file_path,
                uploader_id=uploader_id
            )

            db_upload.save()

            return redirect('dashboard')

    else:
        uploadForm = UploadForm()

    context = { 'uploadForm':uploadForm }

    return render(request, 'pages/upload.html', context=context)

def recipe(request, id):
    recipe_post = MediaUpload.objects.filter(pk=id).select_related("uploader")
    return render(request, 'pages/recipe.html',{ 'recipe_post' : recipe_post })

def recipe_no_id(request):
    return render(request, 'pages/404.html')

@login_required(login_url='login')
def edit_recipe(request, id):
    # get data to display in template
    edit_post = MediaUpload.objects.filter(pk=id).select_related("uploader")

    f = None # file to push to the server
    file_name = None
    file_extension = None
    file_type = None
    file_size = None
    file_path = None

    # check for form
    if request.method == "POST":

        title = request.POST['title']
        description = request.POST.get('description')
        file = request.FILES

        try:
            f = file['file']
            file_name = file['file'].name
            file_extension = file['file'].name.split('.')[1]
            file_type = file['file'].content_type
            file_size = file['file'].size
            file_path = f'media/{file_name}'
        except Exception:
            f = None
            file_name = request.POST['file_name']
            file_extension = request.POST['file_extension']
            file_type = request.POST['file_type']
            file_size = request.POST['file_size']
            file_path = request.POST['file_path']

        # if file is not empty, save to media folder
        if f is not None:
            default_storage.save(file_name, f)

        # update db using Model
        MediaUpload.objects.filter(id=id).update(
            title=title,
            description=description,
            file_name=file_name,
            file_extension=file_extension,
            file_type=file_type,
            file_size=file_size,
            file_path=file_path
        )

        return redirect(f'/recipe/{id}')

    return render(request, 'pages/edit-recipe.html',{ 'edit_post' : edit_post })

def edit_recipe_no_id(request):
    return render(request, 'pages/404.html')

@login_required(login_url='login')
def delete_recipe(request, id):
    delete_post = MediaUpload.objects.filter(id=id)

    # process delete request

    if request.method == "POST":

        post_id = request.POST['post_id']

        MediaUpload.objects.filter(id=post_id).update(
            file_status=0
        )

        return redirect('/dashboard')

    return render(request, 'pages/delete-recipe.html', { 'delete_post': delete_post })

def delete_recipe_no_id(request):
    return render(request, 'pages/404.html')

@login_required(login_url='login')
def activate_recipe(request, id):
    activate_post = MediaUpload.objects.filter(id=id)

    # process delete request

    if request.method == "POST":

        post_id = request.POST['post_id']

        MediaUpload.objects.filter(id=post_id).update(
            file_status=1
        )

        return redirect('/dashboard')

    return render(request, 'pages/activate-recipe.html', { 'activate_post': activate_post })

def activate_recipe_no_id(request):
    return render(request, 'pages/404.html')

def recipes(request):
    return render(request, 'pages/recipes.html')

def search(request):
    if request.method == "GET":

        text = request.GET.get('text') 

        if text:
            data = MediaUpload.objects.filter(title__icontains=text, file_status=1).order_by('-id')

            return render(request, 'pages/search.html', { 'data': data, 'text': text })

def api_media_posts(request):
    media_posts = MediaUpload.objects.filter(file_status=1)
    media_list = serializers.serialize('json', media_posts)
    return HttpResponse(media_list, content_type="application/json;charset=UTF-8")

def api_dashboard_data(request):
    total_media_posts = MediaUpload.objects.all().order_by('-id')
    json_total_media_posts = serializers.serialize('json', total_media_posts)
    return HttpResponse(json_total_media_posts, content_type="application/json;charset=UTF-8")

def api_search_data(request):
    if request.method == "GET":
        text = request.GET.get('text')
        if text:
            data = MediaUpload.objects.filter(title__icontains=text, file_status=1).order_by('-id')

            data_json = serializers.serialize('json', data)
            return HttpResponse(data_json, content_type="application/json;charset=UTF-8")