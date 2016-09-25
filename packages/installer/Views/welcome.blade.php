@extends('installer::layouts.master')

@section('title', trans('messages.welcome.title'))
@section('container')
    <p class="paragraph">{{ trans('messages.welcome.message') }}</p>
    <div class="buttons">
        <a href="{{ route('EJCInstaller::environment') }}" class="button">{{ trans('messages.next') }}</a>
    </div>
@stop