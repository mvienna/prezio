<?php

namespace App\Enums;

enum PresentationSlideTemplateCategoryType: string
{
    case WORK = 'work';
    case SCHOOL = 'school';
    case FUN = 'fun';
    case HOLIDAYS = 'holidays';
    case OTHER = 'other';
    case CUSTOM = 'custom';
}
