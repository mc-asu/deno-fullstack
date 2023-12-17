import { Router } from 'https://deno.land/x/oak/mod.ts';

const router = new Router();
import { getDb } from '../helpers/db_client.ts';
import { ObjectId, WithId } from "npm:mongodb@6";

interface Todo {
  _id?: ObjectId;
  text: string;
}

router.get('/todos', async (ctx) => {
  try {
    const todos: WithId<Todo>[] = await getDb().collection<Todo>('todos').find().toArray();

    const transformedTodos = todos.map(({ _id, text }: WithId<Todo>) => ({ id: _id, text }));
    ctx.response.body = { todos: transformedTodos };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: 'Internal Server Error' };
    console.error('Error fetching todos:', error);
  }
});

router.post('/todos', async (ctx) => {
  try {
    const data = await ctx.request.body().value;

    const newTodo: Todo = {
      text: data.text,
    };

    const insertResult = await getDb().collection<Todo>('todos').insertOne(newTodo);

    if (insertResult) {
      ctx.response.status = 201;
      ctx.response.body = { message: 'Created todo!', todo: newTodo };
    } else {
      ctx.response.status = 500;
      ctx.response.body = { message: 'Failed to create todo' };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: 'Internal Server Error' };
    console.error('Error creating todo:', error);
  }
});

router.put('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId;
  const objectIdTid = new ObjectId(tid);

  const data = await ctx.request.body().value;

  try {
    const result = await getDb().collection<Todo>('todos').updateOne(
      { _id: objectIdTid },
      { $set: { text: data.text } }
    );

    if (result.modifiedCount === 1) {
      ctx.response.body = { message: 'Todo updated successfully' };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: 'Todo not found' };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: 'Internal Server Error' };
    console.error('Error updating todo:', error);
  }
});

router.delete('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId;
  const objectIdTid = new ObjectId(tid);

  try {
    // Check if the todo exists before attempting to delete
    const result = await getDb().collection('todos').deleteOne({ _id: objectIdTid });

    if (result.deletedCount === 1) {
      ctx.response.body = { message: 'Todo deleted successfully' };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: 'Todo not found' };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { message: 'Internal Server Error' };
    console.error('Error deleting todo:', error);
  }
});

export default router;
