<?php

namespace App\Traits;

trait TruncateStrings {
    protected static function bootTruncateStrings()
    {
        static::saving(function ($model) {
            foreach ($model->getTruncateStrings() as $column => $maxLength) {
            if (is_string($model->$column) && strlen($model->$column) > $maxLength) {
                $model->$column = substr($model->$column, 0, $maxLength);
            }
            }
        });
    }

    protected function getTruncateStrings() {
        return property_exists($this, 'truncateStrings') ? $this->truncateStrings : [];
    }
}
