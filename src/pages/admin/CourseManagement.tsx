
import { useState, useEffect } from 'react';
import { Course, courses as initialCourses } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Edit, Plus, Trash2 } from 'lucide-react';

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState('');
  const [instructor, setInstructor] = useState('');
  const [level, setLevel] = useState('');
  const [details, setDetails] = useState('');
  const [currency, setCurrency] = useState('₹');
  
  useEffect(() => {
    // Load courses from localStorage or use initial courses
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    } else {
      setCourses(initialCourses);
      localStorage.setItem('courses', JSON.stringify(initialCourses));
    }
  }, []);
  
  const saveCourses = (updatedCourses: Course[]) => {
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('');
    setDuration('');
    setImage('/placeholder.svg');
    setInstructor('');
    setLevel('Beginner');
    setDetails('');
    setCurrency('₹');
  };
  
  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price.toString());
    setDuration(course.duration);
    setImage(course.image);
    setInstructor(course.instructor);
    setLevel(course.level);
    setDetails(course.details || '');
    setCurrency(course.currency || '₹');
    setIsEditDialogOpen(true);
  };
  
  const handleAddCourse = () => {
    if (!title || !description || !price || !duration) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const newCourse: Course = {
      id: crypto.randomUUID(),
      title,
      description,
      price: parseFloat(price),
      duration,
      image: image || '/placeholder.svg',
      instructor,
      level,
      details,
      currency
    };
    
    const updatedCourses = [...courses, newCourse];
    saveCourses(updatedCourses);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success('Course added successfully');
  };
  
  const handleUpdateCourse = () => {
    if (!editingCourse) return;
    
    if (!title || !description || !price || !duration) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const updatedCourse: Course = {
      ...editingCourse,
      title,
      description,
      price: parseFloat(price),
      duration,
      image: image || '/placeholder.svg',
      instructor,
      level,
      details,
      currency
    };
    
    const updatedCourses = courses.map(c => 
      c.id === editingCourse.id ? updatedCourse : c
    );
    
    saveCourses(updatedCourses);
    setIsEditDialogOpen(false);
    toast.success('Course updated successfully');
  };
  
  const handleDeleteCourse = () => {
    if (!editingCourse) return;
    
    const updatedCourses = courses.filter(c => c.id !== editingCourse.id);
    saveCourses(updatedCourses);
    setIsDeleteDialogOpen(false);
    toast.success('Course deleted successfully');
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>Fill in the details to create a new course.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price</Label>
                <div className="col-span-3 flex">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="₹" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="₹">₹</SelectItem>
                      <SelectItem value="$">$</SelectItem>
                      <SelectItem value="€">€</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="flex-1 ml-2"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">Duration</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. 4 weeks"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">Image URL</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="col-span-3"
                  placeholder="/placeholder.svg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="instructor" className="text-right">Instructor</Label>
                <Input
                  id="instructor"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="details" className="text-right pt-2">Details</Label>
                <Textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="col-span-3 min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCourse}>Add Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={course.image || '/placeholder.svg'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded-md text-sm font-medium">
                {course.currency} {course.price.toLocaleString('en-IN')}
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-1">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{course.duration}</span>
                <span className="text-sm font-medium">{course.level}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(course)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEditingCourse(course);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>Update the course details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">Price</Label>
              <div className="col-span-3 flex">
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="₹" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="₹">₹</SelectItem>
                    <SelectItem value="$">$</SelectItem>
                    <SelectItem value="€">€</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="edit-price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="flex-1 ml-2"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-duration" className="text-right">Duration</Label>
              <Input
                id="edit-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-image" className="text-right">Image URL</Label>
              <Input
                id="edit-image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-instructor" className="text-right">Instructor</Label>
              <Input
                id="edit-instructor"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-level" className="text-right">Level</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-details" className="text-right pt-2">Details</Label>
              <Textarea
                id="edit-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="col-span-3 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCourse}>Update Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManagement;
