#define FUNC2(x,y) x##y
#define FUNC1(x,y) FUNC2(x,y)
#define FUNC(x) FUNC1(x,__COUNTER__)

int FUNC(my_unique_prefix);
int FUNC(my_unique_prefix);

int main() {
   my_unique_prefix0 = 0;
   printf_s("\n%d",my_unique_prefix0);
   my_unique_prefix0++;
   printf_s("\n%d",my_unique_prefix0);
}

