<?php

namespace App\Traits;

trait TruncateStrings {
    protected static function bootTruncateStrings()
    {
        static::saving(function ($model) {
            foreach ($model->getTruncateStrings() as $column => $maxLength) {
                if (is_string($model->$column) && mb_strlen($model->$column, 'UTF-8') > $maxLength) {
                    $model->$column = mb_substr($model->$column, 0, $maxLength, 'UTF-8');
                }
            }
        });
    }

    protected function getTruncateStrings() {
        return property_exists($this, 'truncateStrings') ? $this->truncateStrings : [];
    }
}
