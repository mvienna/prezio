<?php

namespace App\Repositories;

use App\Models\VerificationCode;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class VerificationCodeRepository extends BaseRepository
{
    public function __construct(VerificationCode $model)
    {
        parent::__construct($model);
    }

    public function generateCode(string $email, $digits = 4, $expirationMinutes = 15): int
    {
        $min = pow(10, $digits - 1);
        $max = pow(10, $digits) - 1;
        $code = random_int($min, $max);

        $this->create([
            'email' => $email,
            'code' => $code,
            'expires_at' => Carbon::now()->addMinutes($expirationMinutes)
        ]);

        return $code;
    }

    public function setAllCodesAsExpired(string $email): int
    {
        return $this->model::query()
            ->where('email', $email)
            ->update([
                'expires_at' => Carbon::now(),
            ]);
    }

    public function findByCodeAndEmailNotExpired(string $code, string $email): ?Model
    {
        return $this->model::query()
            ->where('code', $code)
            ->where('email', $email)
            ->where(function (Builder $query) {
                $query->where('expires_at', '>',  Carbon::now())
                    ->orWhereNull('expires_at');
            })
            ->first();
    }
}
