import React from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function MusicForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    const navigate = useNavigate();
    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker enable all
   
    const testIdPrefix = "MusicForm";

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="title">Title</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-title"}
                    id="title"
                    type="text"
                    isInvalid={Boolean(errors.title)}
                    {...register("title", {
                        required: "Title is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.title?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Label htmlFor="album">Album</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-album"}
                    id="album"
                    type="text"
                    isInvalid={Boolean(errors.album)}
                    {...register("album", {
                        required: "Album is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.album?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="artist">Artist</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-artist"}
                    id="artist"
                    type="text"
                    isInvalid={Boolean(errors.artist)}
                    {...register("artist", {
                        required: "Artist is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.artist?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="genre">Genre</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-genre"}
                    id="genre"
                    type="text"
                    isInvalid={Boolean(errors.genre)}
                    {...register("genre", {
                        required: "Genre is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.genre?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default MusicForm;