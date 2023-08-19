<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class BaseRepository
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function builder(): Builder
    {
        return $this->model::query();
    }

    public function createModelInstance(array $defaultValues = []): Model
    {
        $className = get_class($this->model);

        $this->model = new $className;
        foreach ($defaultValues as $param => $value) {
            $this->model->{$param} = $value;
        }

        return $this->model;
    }

    public function reset(): self
    {
        $this->createModelInstance();
        return $this;
    }

    public function create(array $attributes): Model
    {
        return $this->model->create($attributes);
    }

    public function set(Model $model): self
    {
        $this->model = $model;

        return $this;
    }

    public function find($id): ?Model
    {
        return $this->model->find($id);
    }

    public function first(): ?Model
    {
        return $this->model->first();
    }

    public function all(): Collection
    {
        return $this->model->all();
    }

    public function count(): int
    {
        return $this->model->count();
    }

    public function update(array $attributes): ?Model
    {
        $this->model->update($attributes);
        return $this->model->fresh();
    }
}
