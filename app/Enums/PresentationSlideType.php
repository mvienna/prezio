<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum PresentationSlideType: string
{
    use EnumToArray;

    /*
     * content
     */
    case CONTENT = 'content';
    case QR = 'qr';
    case VIDEO = 'video';

    /*
     * quizzes & games
     */
    case PICK_ANSWER = 'pick_answer';
    case PICK_IMAGE = 'pick_image';
    case TYPE_ANSWER = 'type_answer';
    case MATCH_PAIRS = 'match_pairs';
    case CORRECT_ORDER = 'correct_order';

    /*
     * opinion & qna
     */
    case POLL = 'poll';
    case OPEN_ENDED = 'open_ended';
    case WORD_CLOUD = 'word_cloud';
    case QNA = 'qna';
    case BRAIN_STORM = 'brain_storm';
}
