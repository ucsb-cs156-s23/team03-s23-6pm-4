import React from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function ApartmentForm({ initialContents, submitAction, buttonLabel = "Create" }) {

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
   
    const testIdPrefix = "ApartmentForm";

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
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-name"}
                    id="name"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("name", {
                        required: "Name is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="address">Address</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-address"}
                    id="address"
                    type="text"
                    isInvalid={Boolean(errors.address)}
                    {...register("address", {
                        required: "Address is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.address?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="city">City</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-city"}
                    id="city"
                    type="text"
                    isInvalid={Boolean(errors.city)}
                    {...register("city", {
                        required: "City is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.city?.message}
                </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="state">State</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-state"}
                    id="state"
                    type="text"
                    isInvalid={Boolean(errors.state)}
                    {...register("state", {
                        required: "State is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.state?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="rooms">Rooms</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-rooms"}
                    id="rooms"
                    type="number"
                    isInvalid={Boolean(errors.rooms)}
                    {...register("rooms", { required: true, min: 0 })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.rooms && 'Number of rooms is required.'}
                    {errors.rooms && 'Number of rooms must be a whole number'}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-description"}
                    id="description"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("description", {
                        required: "Description is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
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

export default ApartmentForm;